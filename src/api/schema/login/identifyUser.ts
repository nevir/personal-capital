import { UserCredential, UserStatus } from '../enums'
import { Email } from '../primitive'
import { Response, UserIdentifiedHeader, AuthorizedHeader } from '../format'

export interface IdentifyUser {
  path: 'login/identifyUser'

  Request: {
    bindDevice: boolean
    redirectTo: string | undefined
    referrerId: unknown | undefined
    skipFirstUse: unknown | undefined
    skipLinkAccount: boolean
    username: Email
  }

  Response: Response<UserIdentifiedHeader | AuthorizedHeader, {
    userStatus: UserStatus
    credentials: UserCredential[]
    allCredentials: { name: UserCredential, status: 'ACTIVE' }
  }>
}
