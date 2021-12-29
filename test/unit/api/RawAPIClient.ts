import { RawAPIClient, APIError } from 'personal-capital'
import { CookieJar } from 'tough-cookie'
import fetch from 'jest-fetch-mock'

describe('RawAPIClient', () => {
  beforeEach(() => {
    fetch.resetMocks()
  })

  describe('constructor', () => {
    it('uses global fetch if available', async () => {
      fetch.mockReject(new Error('bewm'))

      const simpleInit = new RawAPIClient(new CookieJar())

      await expect(async () => {
        await simpleInit.call('login/querySession', {})
      }).rejects.toThrow(/bewm/)
    })

    it('uses the passed in fetch implementation', async () => {
      const customFetch = jest.fn()
      customFetch.mockRejectedValue(new Error('bewm'))

      const simpleInit = new RawAPIClient(new CookieJar(), customFetch)

      await expect(async () => {
        await simpleInit.call('login/querySession', {})
      }).rejects.toThrow(/bewm/)
    })

    it('complains if global fetch is missing and no fetch was provided', () => {
      const originalFetch = global.fetch
      delete (global as any).fetch

      try {
        expect(() => {
          new RawAPIClient(new CookieJar())
        }).toThrow(/provide.*fetch/i)
      } finally {
        (global as any).fetch = originalFetch
      }
    })
  })

  describe('call', () => {
    let client: RawAPIClient
    beforeEach(() => {
      client = new RawAPIClient(new CookieJar(), undefined, {
        baseUrl: 'https://pc.fake/api/',
        initialCsrfUrl: 'https://pc.fake/csrf',
        initialCsrfPattern: /window\.csrf\s*=\s*'([^']+)'/,
      })
      fetch.mockOnceIf('https://pc.fake/csrf', `window.csrf='00000000-dead-beef-0123456789ab'`)
    })

    describe('fetching the initial CSRF token ', () => {
      beforeEach(() => {
        fetch.resetMocks()
      })

      it('fetches one', async () => {
        fetch.mockOnceIf('https://pc.fake/csrf', `
          <html>
            <head>
              <title>TOTALLY REALLY A PERSONAL CAPITAL PAGE</title>
            </head>
            <body>
              <script>
                window.csrf='00000000-dead-beef-0123456789ab'
              </script>
            </body>
          </html>
        `)
        fetch.mockOnceIf('https://pc.fake/api/login/querySession', JSON.stringify({ spHeader: { success: true } }))

        await client.call('login/querySession', {})
        expect(fetch.mock.calls.length).toBe(2)
      })

      it('errors if it gets a bad response', async () => {
        fetch.mockOnceIf('https://pc.fake/csrf', `500 BEWM: INTERNAL SERVER ERROR`, {
          status: 500,
          statusText: 'Bewm: Internal Server Error',
        })

        await expect(async () => {
          await client.call('login/querySession', {})
        }).rejects.toThrow(/unable to fetch.*bewm/i)
      })

      it('errors if it cannot parse the token', async () => {
        fetch.mockOnceIf('https://pc.fake/csrf', `<html>No token here</html>`)

        await expect(async () => {
          await client.call('login/querySession', {})
        }).rejects.toThrow(/CSRF token/i)
      })
    })

    it('throws if not successful', async () => {
      fetch.mockOnceIf('https://pc.fake/api/login/querySession', JSON.stringify({
        spHeader: {
          success: false,
          errors: [
            { code: 123, message: 'bewm' },
          ],
        }
      }))

      await expect(async () => {
        await client.call('login/querySession', {})
      }).rejects.toThrow(APIError)
    })

    it('sends the CSRF token as a param', async () => {
      fetch.mockOnceIf('https://pc.fake/api/login/querySession', JSON.stringify({ spHeader: { success: true } }))
      await client.call('login/querySession', {})

      expect(fetch).toBeCalledWith('https://pc.fake/api/login/querySession', expect.objectContaining({
        body: expect.stringContaining('csrf=00000000-dead-beef-0123456789ab'),
      }))
    })

    it('updates the CSRF token for subsequent calls', async () => {
      fetch.mockOnceIf('https://pc.fake/api/login/querySession', JSON.stringify({
        spHeader: {
          success: true,
          csrf: '10000000-dead-beef-0123456789ab',
        }
      }))

      await client.call('login/querySession', {})
      expect(fetch).not.toBeCalledWith('https://pc.fake/api/login/querySession', expect.objectContaining({
        body: expect.stringContaining('csrf=10000000-dead-beef-0123456789ab'),
      }))

      fetch.mockOnceIf('https://pc.fake/api/login/querySession', JSON.stringify({
        spHeader: {
          success: true,
          csrf: '20000000-dead-beef-0123456789ab',
        }
      }))

      await client.call('login/querySession', {})
      expect(fetch).toBeCalledWith('https://pc.fake/api/login/querySession', expect.objectContaining({
        body: expect.stringContaining('csrf=10000000-dead-beef-0123456789ab'),
      }))
    })

    it('sends -1 for server change id if unknown', async () => {
      fetch.mockOnceIf('https://pc.fake/api/login/querySession', JSON.stringify({ spHeader: { success: true } }))
      await client.call('login/querySession', {})

      expect(fetch).toBeCalledWith('https://pc.fake/api/login/querySession', expect.objectContaining({
        body: expect.stringContaining('lastServerChangeId=-1'),
      }))
    })

    it('forwards the last seen server change id', async () => {
      fetch.mockOnceIf('https://pc.fake/api/login/querySession', JSON.stringify({
        spHeader: {
          success: true,
          SP_DATA_CHANGES: [
            { serverChangeId: 123 }
          ]
        }
      }))
      await client.call('login/querySession', {})

      fetch.mockOnceIf('https://pc.fake/api/login/querySession', JSON.stringify({ spHeader: { success: true } }))
      await client.call('login/querySession', {})

      expect(fetch).toBeCalledWith('https://pc.fake/api/login/querySession', expect.objectContaining({
        body: expect.stringContaining('lastServerChangeId=123'),
      }))
    })

    it('forwards cookies', async () => {
      fetch.mockOnceIf('https://pc.fake/api/login/querySession', JSON.stringify({ spHeader: { success: true } }), {
        headers: {
          'Set-Cookie': `foo=bar`
        },
      })
      await client.call('login/querySession', {})

      fetch.mockOnceIf('https://pc.fake/api/login/querySession', JSON.stringify({ spHeader: { success: true } }))
      await client.call('login/querySession', {})

      expect(fetch).toBeCalledWith('https://pc.fake/api/login/querySession', expect.objectContaining({
        headers: expect.objectContaining({
          'Cookie': expect.stringContaining('foo=bar'),
        }),
      }))
    })
  })
})
