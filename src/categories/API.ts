import { APIClient, APIRequest } from '../api/APIClient'
import { AuthenticationLevel, UserStatus } from '../api/schema/enums'
import { FieldError, Header, Response, ServerDataChange } from '../api/schema/format'
import { Operation } from '../api/schema/operations'
import { Email, UUID, GUID } from '../api/schema/primitive'

export interface Session {
  /** The current authentication level of this session. */
  authenticationLevel: AuthenticationLevel

  /** The last known CSRF token. */
  csrf: UUID

  /** The last known server change ID. */
  changeId?: number

  /** Information about the current user. */
  user?: {
    /** The user's email address (their username). */
    email: Email
    /** The user's id. */
    id: number
    /** The user's guid. */
    guid: GUID
    /** The user's status. */
    status: UserStatus
    /** Whether the user is a delegate user or primary user. */
    isDelegate: boolean
    /** Whether the user is a qualified lead (sales?). */
    isQualifiedLead: boolean
    /** Whether the user is a beta tester. */
    isBetaTester: boolean
    /** Whether the user is a developer. */
    isDeveloper: boolean
  }

  /** Information about the current device. */
  device?: {
    /** The name of the current device. */
    name: string
  }

  /** Information about the account (across all users). */
  account?: {
    /** ??? */
    hasAggregated: boolean
    /** ??? */
    hasCash: boolean
    /** ??? */
    hasCredit: boolean
    /** ??? */
    hasInvestment: boolean
    /** ??? */
    hasOnUs: boolean
  }
}

export class APIError extends Error {
  errors: FieldError[]

  constructor(message: string, public header?: Header) {
    super(`${message}: ${JSON.stringify(header?.errors)}`)

    this.errors = header?.errors || []

    // https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, APIError.prototype)
  }
}

export abstract class API {
  abstract api: APIClient

  private _session?: Session

  /**
   * Metadata describing the current session.
   */
  get session(): Session {
    if (!this._session) {
      throw new Error('session cannot be accessed prior to invoking call()')
    }
    return this._session
  }

  /**
   * Calls an operation on the Personal Capital API.
   *
   * Note that this handles all session-related state, such as maintaining the
   * CSRF token, last remote update, and other session level metadata.
   */
  async call<TName extends keyof Operation>(
    operation: TName,
    request: Operation[TName]['Request']
  ): Promise<Operation[TName]['Response']['spData']> {
    if (!this._session) {
      this._session = {
        authenticationLevel: 'NONE',
        csrf: await this.api.getInitialCsrfToken(),
      }
    }

    const base: APIRequest = {
      csrf: this._session.csrf,
      lastServerChangeId: this._session.changeId || -1,
    }
    const { spHeader, spData } = await this.api.call(operation, { ...request, ...base }) as Response<Header>
    this._session = extractSession(spHeader, this.session)

    if (!spHeader.success) {
      throw new APIError(operation, spHeader)
    }

    return spData as any
  }
}

function extractSession(spHeader: Header, previous: Session) {
  const newSession: Session = {
    authenticationLevel: spHeader.authLevel,
    csrf: spHeader.csrf || previous.csrf,
    changeId: findHighestChangeId(spHeader.SP_DATA_CHANGES, previous.changeId),
  }

  if ('userGuid' in spHeader) {
    newSession.user = {
      email: spHeader.username,
      id: spHeader.personId,
      guid: spHeader.userGuid,
      status: spHeader.status,
      isDelegate: spHeader.isDelegate,
      isQualifiedLead: spHeader.qualifiedLead,
      isBetaTester: spHeader.betaTester,
      isDeveloper: spHeader.developer,
    }
  }

  if ('deviceName' in spHeader) {
    newSession.device = {
      name: spHeader.deviceName,
    }
  }

  if ('accountsSummary' in spHeader) {
    newSession.account = spHeader.accountsSummary
  } else if ('accountsMetaData' in spHeader) {
    newSession.account = {
      hasAggregated: false,
      hasCash: spHeader.accountsMetaData.includes('HAS_CASH'),
      hasCredit: spHeader.accountsMetaData.includes('HAS_CREDIT'),
      hasInvestment: spHeader.accountsMetaData.includes('HAS_INVESTMENT'),
      hasOnUs: spHeader.accountsMetaData.includes('HAS_ON_US'),
    }
  }

  return newSession
}

function findHighestChangeId(changes?: ServerDataChange[], highestChangeId?: number) {
  if (!changes) return highestChangeId
  for (const { serverChangeId } of changes) {
    if (!highestChangeId || serverChangeId > highestChangeId) {
      highestChangeId = serverChangeId
    }
  }

  return highestChangeId
}
