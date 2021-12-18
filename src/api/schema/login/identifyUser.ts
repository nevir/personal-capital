import { UserCredential, UserStatus } from '../authorization'
import { Email, UUID } from '../primitive'
import { Response, UserIdentifiedHeader, AuthorizedHeader } from '../Response'

export interface IdentifyUser {
  path: 'login/identifyUser'

  Request: {
    apiClient: 'WEB'
    bindDevice: boolean
    csrf: UUID
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
