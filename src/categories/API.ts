import { APIError } from '..'
import { APIClient } from '../api/APIClient'
import { AuthenticationLevel, UserStatus } from '../api/schema/enums'
import { Header, ServerDataChange } from '../api/schema/format'
import { Operation } from '../api/schema/operations'
import { Email, UUID, GUID } from '../api/schema/primitive'

export interface Session {
  /** The current authentication level of this session. */
  authenticationLevel: AuthenticationLevel

  /** The last known CSRF token. */
  csrf?: UUID

  /** The last known server change ID. */
  changeId?: number

  /** Information about the current user. */
  user?: {
    /** The user's email address (their username). */
    email: Email
    /** The user's id. */
    personId: number
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

export abstract class API {
  protected abstract raw: APIClient

  /**
   * Metadata describing the current session.
   *
   * Guaranteed to exist after the first request made via call().
   */
  session?: Session

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
    const { spData, spHeader } = await this.raw.call(operation, request)
    this.session = extractSession(spHeader, this.session)

    if (!spHeader.success) {
      throw new APIError(operation, spHeader)
    }

    return spData
  }
}

function extractSession(spHeader: Header, previous?: Session) {
  const newSession: Session = {
    authenticationLevel: spHeader.authLevel,
    csrf: spHeader.csrf || previous?.csrf,
    changeId: findHighestChangeId(spHeader.SP_DATA_CHANGES, previous?.changeId),
  }

  if ('userGuid' in spHeader) {
    newSession.user = {
      email: spHeader.username,
      personId: spHeader.personId,
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
