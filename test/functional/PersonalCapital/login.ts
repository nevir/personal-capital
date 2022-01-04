import fetch from 'isomorphic-fetch'
import { PersonalCapital, ChallengeType } from 'personal-capital'
import { CookieJar } from 'tough-cookie'
import * as otpauth from 'otpauth'

import { configOrPrompt } from '../../../support/dialog'

// Ideally, we'd do this via jest.config.js, buuuut…
// https://github.com/facebook/jest/issues/9759
jest.setTimeout(2 ** 31 - 1)

describe('PersonalCapital Login Flows', () => {

  describe('TOTP Flow', () => {

    it('can log in', async () => {
      const client = new PersonalCapital(new CookieJar(), fetch)
      const username = await configOrPrompt('username', 'Email Address')
      const password = await configOrPrompt('password', 'Password')
      const totpUrl = await configOrPrompt('totpUrl', 'TOTP URL')
      const otp = otpauth.URI.parse(totpUrl)

      await client.login({
        username,
        password,
        kind: ChallengeType.TOTP,
        code: async () => otp.generate()
      })

      const { authenticationLevel } = await client.querySession()
      expect(authenticationLevel).toEqual('SESSION_AUTHENTICATED')
    })

  })

})
