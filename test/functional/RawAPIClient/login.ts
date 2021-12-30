import fetch from 'isomorphic-fetch'
import { RawAPIClient } from 'personal-capital'
import { CookieJar, } from 'tough-cookie'

import { configOrPrompt, prompt } from '../../support/functional/dialog'

// Ideally, we'd do this via jest.config.js, buuuut…
// https://github.com/facebook/jest/issues/9759
jest.setTimeout(2 ** 31 - 1)

describe('RawAPIClient Login Flows', () => {
  // Skip in VS Code
  if (process.env.VSCODE_PID) {
    it('is skipped when running within VS Code', () => { })
  } else {
    let realUsername: string
    let realPassword: string

    it('was provided the required configuration', async () => {
      realUsername = await configOrPrompt('username', 'Email Address')
      realPassword = await configOrPrompt('password', 'Password')
    })

    describe('SMS Flow', () => {
      const client = new RawAPIClient(new CookieJar(), fetch)
      let deviceName: string

      it('identifies the user', async () => {
        const response = await client.call('login/identifyUser', {
          bindDevice: false,
          redirectTo: '',
          referrerId: '',
          skipFirstUse: '',
          skipLinkAccount: false,
          username: realUsername,
        })
      })

      it('requests a SMS code', async () => {
        const response = await client.call('credential/challengeSms', {
          bindDevice: false,
          challengeMethod: 'OP',
          challengeReason: 'DEVICE_AUTH',
        })
      })

      it('authenticates via the received SMS code', async () => {
        const response = await client.call('credential/authenticateSms', {
          bindDevice: false,
          challengeMethod: 'OP',
          challengeReason: 'DEVICE_AUTH',
          code: await prompt('SMS Code'),
        })
      })

      it('logs in via password', async () => {
        const response = await client.call('credential/authenticatePassword', {
          bindDevice: false,
          deviceName: 'Functional Test Suite (nevir/personal-capital)',
          passwd: realPassword,
          redirectTo: '',
          referrerId: '',
          skipFirstUse: '',
          skipLinkAccount: false,
          username: realUsername,
        })
      })

      it('can read the current session', async () => {
        const response = await client.call('login/querySession', {})
        expect(response.spHeader.authLevel).toEqual('SESSION_AUTHENTICATED')
      })
    })
  }
})
