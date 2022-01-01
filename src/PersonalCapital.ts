import { Mixin } from 'ts-mixer'
import { APIClient } from './api/APIClient'
import { RawAPIClient } from './api/RawAPIClient'
import { CookieJar } from './api/dependencies/cookieJar'
import { Fetch } from './api/dependencies/fetch'
import { PersonalCapitalAuth } from './categories/auth'
import { Operation } from './api/schema/operations'
import { CategoryBase } from './categories/CategoryBase'

export * from './categories/auth'

/**
 * Client for the Personal Capital API.
 */
export class PersonalCapital extends Mixin(CategoryBase, PersonalCapitalAuth) {
  private _api: APIClient

  constructor(cookieJar: CookieJar, fetch?: Fetch, options?: Partial<RawAPIClient.Options>)
  constructor(api: APIClient)
  constructor(cookieJarOrApi: CookieJar | APIClient, fetch?: Fetch, options?: Partial<RawAPIClient.Options>) {
    super()

    if (isCookieJar(cookieJarOrApi)) {
      this._api = new RawAPIClient(cookieJarOrApi, fetch, options)
    } else {
      this._api = cookieJarOrApi
    }
  }

  async call<TName extends keyof Operation>(
    operation: TName,
    request: Operation[TName]['Request']
  ): Promise<Operation[TName]['Response']['spData']> {
    return (await this._api.call(operation, request)).spData
  }

  async querySession() {
    const { spHeader } = await this._api.call('login/querySession', {})
    return spHeader
  }
}

function isCookieJar(value: any): value is CookieJar {
  return typeof value?.setCookie === 'function'
}
