/**
 * We require a fetch-like interface in order to make requests.
 */
export interface Fetch {
  (resource: string, init?: FetchRequestInit): Promise<FetchResponse>
}

export interface FetchRequestInit {
  /** A string to set request's method. */
  method?: string

  /** A Headers object, an object literal, or an array of two-item arrays to set request's headers. */
  headers?: string[][] | Record<string, string> | Headers

  /** A BodyInit object or null to set request's body. */
  body?: string
}

export interface FetchResponse {
  readonly headers: Headers
  readonly ok: boolean
  readonly status: number
  readonly statusText: string
  json(): Promise<any>
  text(): Promise<string>
}

export interface OkFetchResponse extends FetchResponse {
  readonly ok: true
}

interface Headers {
  [Symbol.iterator](): IterableIterator<[string, string]>
  entries(): IterableIterator<[string, string]>
  keys(): IterableIterator<string>
  values(): IterableIterator<string>
  append(name: string, value: string): void
  delete(name: string): void
  get(name: string): string | null
  has(name: string): boolean
  set(name: string, value: string): void
  forEach(callbackfn: (value: string, key: string, parent: Headers) => void, thisArg?: any): void
}
