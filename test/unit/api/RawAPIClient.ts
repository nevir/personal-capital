import { RawAPIClient, APIRequest } from 'personal-capital'
import { CookieJar } from 'tough-cookie'
import fetch from 'jest-fetch-mock'

describe('RawAPIClient', () => {
  const unauthBase: APIRequest = {
    csrf: 'some-fake-csrf-token',
  }

  beforeEach(() => {
    fetch.resetMocks()
  })

  describe('constructor', () => {

    it('uses global fetch if available', async () => {
      fetch.mockReject(new Error('bewm'))

      const simpleInit = new RawAPIClient(new CookieJar())

      await expect(async () => {
        await simpleInit.call('login/querySession', unauthBase)
      }).rejects.toThrow(/bewm/)
    })

    it('uses the passed in fetch implementation', async () => {
      const customFetch = jest.fn()
      customFetch.mockRejectedValue(new Error('bewm'))

      const simpleInit = new RawAPIClient(new CookieJar(), customFetch)

      await expect(async () => {
        await simpleInit.call('login/querySession', unauthBase)
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
        clientType: 'TEST' as any,
        baseUrl: 'https://pc.fake/api/',
        initialCsrfUrl: 'https://pc.fake/csrf',
      })
    })

    it('makes calls via fetch', async () => {
      fetch.mockOnceIf('https://pc.fake/api/foo/bar', JSON.stringify({ data: 123 }))

      const response = await client.call('foo/bar', unauthBase)
      expect(response).toEqual({ data: 123 })
    })

    it('throws if not successful', async () => {
      fetch.mockOnceIf('https://pc.fake/api/login/querySession', JSON.stringify({ nope: true }), { status: 500 })

      await expect(async () => {
        await client.call('login/querySession', unauthBase)
      }).rejects.toThrow(/querySession/)
    })

    it('injects apiClient', async () => {
      fetch.mockOnceIf('https://pc.fake/api/foo/bar', JSON.stringify({ data: 123 }))

      await client.call('foo/bar', unauthBase)
      expect(fetch).toHaveBeenCalledWith('https://pc.fake/api/foo/bar', expect.objectContaining({
        body: expect.stringContaining('apiClient=TEST')
      }))
    })


    it('forwards cookies', async () => {
      fetch.mockOnceIf('https://pc.fake/api/login/querySession', JSON.stringify({ spHeader: { success: true } }), {
        headers: {
          'Set-Cookie': `foo=bar`
        },
      })
      await client.call('login/querySession', unauthBase)

      fetch.mockOnceIf('https://pc.fake/api/login/querySession', JSON.stringify({ spHeader: { success: true } }))
      await client.call('login/querySession', unauthBase)

      expect(fetch).toBeCalledWith('https://pc.fake/api/login/querySession', expect.objectContaining({
        headers: expect.objectContaining({
          'Cookie': expect.stringContaining('foo=bar'),
        }),
      }))
    })
  })

  describe('getInitialCsrfToken', () => {
    let client: RawAPIClient
    beforeEach(() => {
      client = new RawAPIClient(new CookieJar(), undefined, {
        baseUrl: 'https://pc.fake/api/',
        initialCsrfUrl: 'https://pc.fake/csrf',
      })
    })

    it('fetches from an unauthenticated page', async () => {
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

      expect(await client.getInitialCsrfToken()).toBe('00000000-dead-beef-0123456789ab')
    })

    it('fetches from an authenticated page', async () => {
      fetch.mockOnceIf('https://pc.fake/csrf', `
          <html>
            <head>
              <title>TOTALLY REALLY A PERSONAL CAPITAL PAGE</title>
              <script type="text/javascript">
                var csrf = '00000000-dead-beef-0123456789ab',
                  userGuid = 'foobarbaz';
              </script>
            </head>
            <body>content and stuff</body>
          </html>
        `)

      expect(await client.getInitialCsrfToken()).toBe('00000000-dead-beef-0123456789ab')
    })

    it('errors if it gets a bad response', async () => {
      fetch.mockOnceIf('https://pc.fake/csrf', `500 BEWM: INTERNAL SERVER ERROR`, {
        status: 500,
        statusText: 'Bewm: Internal Server Error',
      })

      await expect(async () => {
        await client.getInitialCsrfToken()
      }).rejects.toThrow(/unable to fetch.*bewm/i)
    })

    it('errors if it cannot parse the token', async () => {
      fetch.mockOnceIf('https://pc.fake/csrf', `<html>No token here</html>`)

      await expect(async () => {
        await client.getInitialCsrfToken()
      }).rejects.toThrow(/CSRF token/i)
    })

  })

})
