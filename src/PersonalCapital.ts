import { Mixin } from 'ts-mixer'
import { APIClient } from './api/APIClient'
import { RawAPIClient } from './api/RawAPIClient'
import { CookieJar } from './api/dependencies/cookieJar'
import { Fetch } from './api/dependencies/fetch'
import { PersonalCapitalAuth } from './categories/auth'

export * from './categories/auth'

/**
 * Client for the Personal Capital API.
 */
export class PersonalCapital extends Mixin(PersonalCapitalAuth) {
  api: APIClient

  constructor(cookieJar: CookieJar, fetch?: Fetch, options?: Partial<RawAPIClient.Options>)
  constructor(api: APIClient)
  constructor(cookieJarOrApi: CookieJar | APIClient, fetch?: Fetch, options?: Partial<RawAPIClient.Options>) {
    super()

    if (isCookieJar(cookieJarOrApi)) {
      this.api = new RawAPIClient(cookieJarOrApi, fetch, options)
    } else {
      this.api = cookieJarOrApi
    }
  }

  async querySession() {
    const { spHeader } = await this.api.call('login/querySession', {})
    return spHeader
  }
}

function isCookieJar(value: any): value is CookieJar {
  return typeof value?.setCookie === 'function'
}
