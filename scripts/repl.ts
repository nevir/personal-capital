// This module sets up the environment for the ts-node repl.
import fetch from 'isomorphic-fetch'
import { PersonalCapital, ChallengeType } from 'personal-capital'
import { CookieJar } from 'tough-cookie'
import * as otpauth from 'otpauth'

import { configOrPrompt } from '../support/dialog'

declare global {
  var client: PersonalCapital
}

async function main() {
  const client = new PersonalCapital(new CookieJar(), fetch)
  const username = await configOrPrompt('username', 'Email Address')
  const password = await configOrPrompt('password', 'Password')
  const totpUrl = await configOrPrompt('totpUrl', 'TOTP URL')
  const otp = otpauth.URI.parse(totpUrl)

  const result = await client.login({
    username,
    password,
    kind: ChallengeType.TOTP,
    code: async () => otp.generate()
  })

  global.client = client
}
main()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })