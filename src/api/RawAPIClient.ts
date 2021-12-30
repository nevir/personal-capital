import debug from 'debug'

import { VERSION } from '../version'
import { APIError } from './APIError'
import { CookieJar } from './dependencies/cookieJar'
import { Fetch, FetchRequestInit, OkFetchResponse } from './dependencies/fetch'
import { Operation, OperationName } from './schema/operations'
import { ClientType } from './schema/enums'
import { BaseRequest } from './schema/format'
import { UUID } from './schema/primitive'
import { APIClient } from './APIClient'

const log = debug('personal-capital:RawAPIClient')
let callCount = 0

/**
 * Low level API client for Personal Capital.
 */
export class RawAPIClient implements APIClient {
  private _cookieJar: CookieJar
  private _fetch: Fetch
  private _options: RawAPIClient.Options
  private _lastCsrf?: UUID
  private _lastServerChangeId = -1

  constructor(cookieJar: CookieJar, fetch?: Fetch, options: Partial<RawAPIClient.Options> = {}) {
    if (!fetch) {
      if (!(typeof global.fetch === 'function')) {
        throw new Error(`Please provide an implementation of the fetch API`)
      }
      fetch = global.fetch
    }

    this._cookieJar = cookieJar
    this._fetch = fetch
    this._options = { ...RawAPIClient.DEFAULT_OPTIONS, ...options }
  }

  async call<TName extends OperationName>(
    operation: TName,
    request: Operation[TName]['Request']
  ): Promise<Operation[TName]['Response']> {
    const url = `${this._options.baseUrl}${operation}`
    const commonFields: BaseRequest = {
      apiClient: this._options.clientType,
      csrf: await this.getCurrentCsrf(),
      lastServerChangeId: this._lastServerChangeId,
    }

    const params = { ...request, ...commonFields }
    const body = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(`${value}`)}`)
      .join('&')

    const callId = callCount++
    log('[%d]    call: %s %o', callId, url, params)

    const response = await this.fetch(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      method: 'POST',
      body,
    })

    const data = await response.json() as Operation[TName]['Response']
    log('[%d] response: %O', callId, data)

    if (data?.spHeader?.csrf) {
      this._lastCsrf = data.spHeader.csrf
    }

    for (const { serverChangeId } of data?.spHeader?.SP_DATA_CHANGES || []) {
      if (serverChangeId > this._lastServerChangeId) {
        this._lastServerChangeId = serverChangeId
      }
    }

    if (!data?.spHeader?.success) {
      throw new APIError(operation, data)
    }

    return data
  }

  private async getCurrentCsrf() {
    if (!this._lastCsrf) {
      this._lastCsrf = await this.getInitialCsrf()
    }

    return this._lastCsrf
  }

  private async getInitialCsrf() {
    const { initialCsrfUrl: url, initialCsrfPattern: pattern } = this._options

    const response = await this.fetch(url)
    const body = await response.text()
    const token = pattern.exec(body)?.[1]
    if (typeof token !== 'string') {
      throw new Error(`Unable to locate CSRF token via ${pattern} on ${url}`)
    }

    return token
  }

  private async fetch(resource: string, init?: FetchRequestInit) {
    const response = await this._fetch(resource, {
      ...init,
      headers: {
        'User-Agent': this._options.userAgent,
        'Cookie': await this._cookieJar.getCookieString(resource),
        ...init?.headers,
      }
    })

    const setCookie = response.headers.get('Set-Cookie')
    if (setCookie) {
      for (const cookie of setCookie.split(/,\s*(?=[a-z0-9_\-]+=)/i)) {
        await this._cookieJar.setCookie(cookie, resource)
      }
    }

    if (!response.ok) {
      const message = `${response.status} ${response.statusText}\n${await response.text()}`
      throw new Error(`Unable to fetch ${resource}: ${message}`)
    }

    return response as OkFetchResponse
  }
}

export namespace RawAPIClient {
  export interface Options {
    baseUrl: string
    initialCsrfUrl: string
    initialCsrfPattern: RegExp
    userAgent: string
    clientType: ClientType
  }

  export const DEFAULT_OPTIONS: Options = {
    baseUrl: 'https://home.personalcapital.com/api/',
    initialCsrfUrl: 'https://home.personalcapital.com/page/login/goHome',
    initialCsrfPattern: /window\.csrf\s*=\s*'([^']+)'/,
    userAgent: `personal-capital/${VERSION} (https://github.com/nevir/personal-capital)`,
    clientType: 'WEB'
  }
}
