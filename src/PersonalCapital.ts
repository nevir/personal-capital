import { Mixin } from 'ts-mixer'
import { APIClient } from './api/APIClient'
import { RawAPIClient } from './api/RawAPIClient'
import { CookieJar } from './api/dependencies/cookieJar'
import { Fetch } from './api/dependencies/fetch'
import { Auth } from './categories/Auth'
import { API } from './categories/API'
import { Session } from './categories/Session'
import { Accounts } from './categories/Accounts'
import { Transactions } from './categories/Transactions'

export * from './categories/Auth'
export * from './categories/API'

/**
 * Client for the Personal Capital API.
 */
export class PersonalCapital extends Mixin(API, Auth, Session, Accounts, Transactions) {
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
}

function isCookieJar(value: any): value is CookieJar {
  return typeof value?.setCookie === 'function'
}
