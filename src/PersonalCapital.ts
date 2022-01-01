import { Mixin } from 'ts-mixer'
import { APIClient } from './api/APIClient'
import { RawAPIClient } from './api/RawAPIClient'
import { CookieJar } from './api/dependencies/cookieJar'
import { Fetch } from './api/dependencies/fetch'
import { Auth } from './categories/Auth'
import { API } from './categories/API'

export * from './categories/Auth'

/**
 * Client for the Personal Capital API.
 */
export class PersonalCapital extends Mixin(API, Auth) {
  protected raw: APIClient

  constructor(cookieJar: CookieJar, fetch?: Fetch, options?: Partial<RawAPIClient.Options>)
  constructor(api: APIClient)
  constructor(cookieJarOrApi: CookieJar | APIClient, fetch?: Fetch, options?: Partial<RawAPIClient.Options>) {
    super()

    if (isCookieJar(cookieJarOrApi)) {
      this.raw = new RawAPIClient(cookieJarOrApi, fetch, options)
    } else {
      this.raw = cookieJarOrApi
    }
  }

  async querySession() {
    const { spHeader } = await this.raw.call('login/querySession', {})
    return spHeader
  }
}

function isCookieJar(value: any): value is CookieJar {
  return typeof value?.setCookie === 'function'
}
