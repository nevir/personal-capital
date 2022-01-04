// This module sets up the environment for the ts-node repl.
import fetch from 'isomorphic-fetch'
import { PersonalCapital, ChallengeType } from 'personal-capital'
import { CookieJar } from 'tough-cookie'
import * as otpauth from 'otpauth'

import { configOrPrompt } from '../support/dialog'
import { FileCookieStore } from 'tough-cookie-file-store'

declare global {
  var client: PersonalCapital
}

async function main() {
  const cookies = new CookieJar(new FileCookieStore('./.local.cookies.json'))
  console.log('cookies:', cookies.getCookies('https://home.personalcapital.com/'))
  const client = new PersonalCapital(cookies, fetch)
  const username = await configOrPrompt('username', 'Email Address')
  const password = await configOrPrompt('password', 'Password')
  const totpUrl = await configOrPrompt('totpUrl', 'TOTP URL')
  const otp = otpauth.URI.parse(totpUrl)

  await client.identifyUser(username)

  // await client.login({
  //   username,
  //   password,
  //   deviceName: `Personal Capital REPL`,
  //   kind: ChallengeType.TOTP,
  //   code: async () => otp.generate()
  // })

  global.client = client
}
main()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
