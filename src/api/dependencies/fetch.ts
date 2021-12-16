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
  headers?: Record<string, string>

  /** A BodyInit object or null to set request's body. */
  body?: string
}

export interface FetchResponse {
  readonly headers: Record<string, string>
  readonly ok: boolean
  readonly status: number
  readonly statusText: string
  json(): Promise<any>
  text(): Promise<string>
}
