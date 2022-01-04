import { UUID } from './schema/primitive'

/**
 * Base fields that should be passed with all requests.
 */
export interface APIRequest {
  /** The most recent CSRF token associated with this session. */
  csrf: UUID
  /** The most recent server change id associated with this session. */
  lastServerChangeId?: number
  /** And any number of additional fields according to the API contract. */
  [key: string]: unknown
}

/**
 * A low level stateless Personal Capital API client.
 */
export interface APIClient {
  /**
   * Make a low level call to the Personal Capital API.
   *
   * @returns JSON data from the response, or throws if not a valid response.
   */
  call(
    operation: string,
    request: APIRequest,
  ): Promise<unknown>

  /**
   * Fetch an initial CSRF token to use when calling the Personal Capital API.
   */
  getInitialCsrfToken(): Promise<UUID>
}
