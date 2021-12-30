import fetch from 'isomorphic-fetch'
import { PersonalCapital, ChallengeType } from 'personal-capital'
import { CookieJar } from 'tough-cookie'
import * as otpauth from 'otpauth'

import { configOrPrompt } from '../../support/functional/dialog'

describe('PersonalCapital Login Flows', () => {

  describe('TOTP Flow', () => {
    const client = new PersonalCapital(new CookieJar(), fetch)

    it('can log in', async () => {
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

      const session = await client.querySession()
      expect(session.authLevel).toEqual('SESSION_AUTHENTICATED')
    })
  })

})
