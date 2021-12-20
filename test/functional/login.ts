import * as dialog from 'dialog-node'
import fetch from 'isomorphic-fetch'
import { APIClient } from 'personal-capital'
import { CookieJar, } from 'tough-cookie'
import * as util from 'util'

import { UUID } from '../../src/api/schema/primitive'

let config: any
try {
  config = require('../../.config.local.json')
} catch {
  config = {}
}

// Ideally, we'd do this via jest.config.js, buuuut…
// https://github.com/facebook/jest/issues/9759
jest.setTimeout(2 ** 31 - 1)

describe('login', () => {
  let realUsername: string
  let realPassword: string

  async function prompt(message: string, title = message): Promise<string> {
    return new Promise((resolve, reject) => {
      dialog.entry(message, title, 0, (code, value, error) => {
        if (code !== 0) {
          reject(new Error(`Prompt failure: ${error} (code ${code})`))
        } else {
          resolve(value)
        }
      })
    })
  }

  async function configOrPrompt(key: string, message: string) {
    if (config[key]) return config[key]
    return await prompt(message, `Enter your Personal Capital account details`)
  }

  it('was provided the required configuration', async () => {
    realUsername = await configOrPrompt('username', 'Email Address')
    realPassword = await configOrPrompt('password', 'Password')
  })

  describe('SMS Flow', () => {
    const client = new APIClient(fetch, new CookieJar())
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

})
