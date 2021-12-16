import { VERSION } from '../version'
import { Fetch, FetchRequestInit } from './dependencies/fetch'

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
