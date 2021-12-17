import { VERSION } from '../version'
import { APIError } from './APIError'
import { Fetch, FetchRequestInit } from './dependencies/fetch'
import { Operation, OperationName } from './schema'

/**
 * Low level API client for Personal Capital.
 */
export class APIClient {
  private _fetch: Fetch
  private _options: APIClient.Options

  constructor(fetch: Fetch, options: Partial<APIClient.Options> = {}) {
    this._fetch = fetch
    this._options = { ...APIClient.DEFAULT_OPTIONS, ...options }
  }

  async call<TName extends OperationName>(
    operation: TName,
    request: Operation<TName>['Request']
  ): Promise<Operation<TName>['Response']> {
    const url = `${this._options.baseUrl}${operation}`
    const params = Object.entries(request)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(`${value}`)}`)
      .join('&')

    const response = await this.fetch(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      method: 'POST',
      body: params,
    })
    if (!response.ok) {
      const message = `${response.status} ${response.statusText}\n${await response.text()}`
      throw new Error(`Unable to fetch ${operation}: ${message}`)
    }

    const data = await response.json()
    if (!data?.spHeader?.success) {
      throw new APIError(operation, data)
    }

    return data
  }

  async getInitialCsrf() {
    const { initialCsrfUrl: url, initialCsrfPattern: pattern } = this._options

    const response = await this._fetch(url)
    const body = await response.text()
    if (!response.ok) {
      const message = `${response.status} ${response.statusText}\n${body}`
      throw new Error(`Unable to fetch page for initial CSRF token: ${message}`)
    }

    const token = pattern.exec(body)?.[1]
    if (typeof token !== 'string') {
      throw new Error(`Unable to locate CSRF token via ${pattern} on ${url}`)
    }

    return token
  }

  async fetch(resource: string, init?: FetchRequestInit) {
    return this._fetch(resource, {
      ...init,
      headers: {
        'User-Agent': this._options.userAgent,
        ...init?.headers,
      }
    })
  }
}

export namespace APIClient {
  export interface Options {
    baseUrl: string
    initialCsrfUrl: string
    initialCsrfPattern: RegExp
    userAgent: string
  }

  export const DEFAULT_OPTIONS: Options = {
    baseUrl: 'https://home.personalcapital.com/api/',
    initialCsrfUrl: 'https://home.personalcapital.com/page/login/goHome',
    initialCsrfPattern: /window\.csrf ='([^']+)'/,
    userAgent: `personal-capital/${VERSION} (https://github.com/nevir/personal-capital)`,
  }
}
