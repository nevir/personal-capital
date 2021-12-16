import fetch from 'isomorphic-fetch'
import { APIClient } from 'personal-capital'

const { PC_EMAIL } = process.env

describe('login', () => {

  it('was provided the required env vars', () => {
    expect(PC_EMAIL).not.toBeUndefined()
  })

  it('supports the SMS flow', async () => {
    const client = new APIClient(fetch)

    const csrf = await client.getInitialCsrf()
    console.log('got initial csrf:', csrf)

    const response = await client.call('login/identifyUser', {
      apiClient: 'WEB',
      bindDevice: false,
      csrf,
      redirectTo: '',
      referrerId: '',
      skipFirstUse: '',
      skipLinkAccount: false,
      username: PC_EMAIL!,
    })
    console.log('got response:', JSON.stringify(response, null, 2))

  })

})
