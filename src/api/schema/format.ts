import { AccountMetaData, AuthenticationLevel, ClientType, ServerDataChangeType, UserStatus } from './enums'
import { Email, GUID, UUID } from './primitive'

/**
 * Properties common to all Personal Capital Requests
 */
export interface Request {
  /** The kind of making the request. */
  apiClient: ClientType
  /** The most recent CSRF token associated with this session. */
  csrf: UUID
  /** The most recent server change id associated with this session. */
  lastServerChangeId: number
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
interface BaseHeader {
  /** The session's current state in the authorization workflow. */
  authLevel: AuthenticationLevel
  /** CSRF token to use in the following request. */
  csrf?: UUID
  /** Any errors associated with the request. */
  errors?: FieldError[]
  /** The Personal Capital API interface version. */
  SP_HEADER_VERSION: number
  /** Any data changes that occurred after lastServerChangeId. */
  SP_DATA_CHANGES?: ServerDataChange[]
  /** The user's status. */
  status: UserStatus
  /** ??? */
  success: boolean
}

/**
 * Properties common to remembered and signed in users.
 */
interface BaseHeaderWithUser extends BaseHeader {
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
  /** The current user's guid. */
  userGuid: GUID
  /** The user's email address. */
  username: Email
  /** ??? */
  userStage: 'F'
}

/**
 * Session-level metadata returned for an unauthenticated session.
 */
export interface UnauthenticatedHeader extends BaseHeader {
  authLevel: 'NONE'
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
 * Session-level metadata returned for a fully authenticated session.
 */
export interface AuthenticatedHeader extends BaseHeaderWithUser {
  authLevel: 'SESSION_AUTHENTICATED'
}

export type Header =
  | AuthenticatedHeader
  | AuthorizedHeader
  | UnauthenticatedHeader
  | UserIdentifiedHeader

/**
 * A server data change.
 */
export interface ServerDataChange {
  serverChangeId: number
  details: any
  eventType: ServerDataChangeType
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
