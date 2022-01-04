import { API } from './API'

/**
 * Authentication related calls for the Personal Capital API.
 */
export abstract class Session extends API {
  async querySession() {
    await this.call('login/querySession', {})

    return this.session
  }
}
