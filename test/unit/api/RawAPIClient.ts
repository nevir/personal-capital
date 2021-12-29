import { RawAPIClient } from 'personal-capital'
import { CookieJar } from 'tough-cookie'
import fetch from 'jest-fetch-mock'

describe('RawAPIClient', () => {
  describe('constructor', () => {
    it('uses global fetch if available', async () => {
      fetch.doMock()
      fetch.mockReject(new Error('bewm'))

      const simpleInit = new RawAPIClient(new CookieJar())

      expect(async () => {
        await simpleInit.call('login/querySession', {})
      }).rejects.toThrow(/bewm/)
    })
  })
})
