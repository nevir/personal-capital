import { AccountMetaData, AuthenticationLevel, Client, UserStatus } from './enums'
import { Email, GUID, UUID } from './primitive'

/**
 * Properties common to all Personal Capital Requests
 */
export interface BaseRequest {
  /** The kind of making the request. */
  apiClient: Client
  /** The most recent CSRF token associated with this session. */
  csrf: UUID
}

/**
 * A response (JSON) payload from the Personal Capital API.
 */
export interface Response<THeader extends BaseHeader = BaseHeader, TData = unknown> {
  spHeader: THeader
  spData: TData
}

/**
 * Properties common to all header types.
 */
export interface BaseHeader {
  /** The session's current state in the authorization workflow. */
  authLevel: AuthenticationLevel
  /** CSRF token to use in the following request. */
  csrf?: UUID
  /** Any errors associated with the request. */
  errors?: FieldError[]
  /** The Personal Capital API interface version. */
  SP_HEADER_VERSION: number
  /** The user's status. */
  status: UserStatus
  /** ??? */
  success: boolean
  /** The current user's guid. */
  userGuid: GUID
  /** The user's email address. */
  username: Email
}

/**
 * Properties common to remembered and signed in users.
 */
export interface BaseHeaderWithUser extends BaseHeader {
  /** Flags indicating which specific functionality is enabled. */
  accountsMetaData: AccountMetaData[]
  /** Whether the current user is a beta tester. */
  betaTester: boolean
  /** Whether the current user is a Personal Capital developer. */
  developer: boolean
  /** The user-provided name for the current device. */
  deviceName: string
  /** Whether the user is an account delegate of a primary user. */
  isDelegate: boolean
  /** ??? */
  personId: number
  /** ??? */
  qualifiedLead: boolean
  /** ??? */
  userStage: 'F'
}

/**
 * Session-level metadata returned for an identified user.
 */
export interface UserIdentifiedHeader extends BaseHeader {
  authLevel: 'USER_IDENTIFIED'
}

/**
* Session-level metadata returned for an identified & remembered user.
*/
export interface AuthorizedHeader extends BaseHeaderWithUser {
  authLevel: 'USER_REMEMBERED' | 'DEVICE_AUTHORIZED'

  /** Legacy(?) flags for specific functionality. */
  accountsSummary: {
    hasAggregated: boolean
    hasCash: boolean
    hasCredit: boolean
    hasInvestment: boolean
    hasOnUs: boolean
  }
}

/**
 * Error information about a specific field in a request.
 */
export interface FieldError<TField extends string = string> {
  code: number
  message: string
  details: {
    fieldName: TField
    originalValue: any
  }
}
