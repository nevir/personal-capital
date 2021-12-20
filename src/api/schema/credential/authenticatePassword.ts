import { UserCredential } from '../enums'
import { Email, UUID } from '../primitive'
import { Response, AuthorizedHeader } from '../format'

export interface AuthenticatePassword {
  path: 'credential/authenticatePassword'

  Request: {
    apiClient: 'WEB'
    bindDevice: boolean
    csrf: UUID
    deviceName: string
    passwd: string
    redirectTo: string | undefined
    referrerId: unknown | undefined
    skipFirstUse: unknown | undefined
    skipLinkAccount: boolean
    username: Email
  }

  Response: Response<AuthorizedHeader, {
    credentials: UserCredential[]
    allCredentials: { name: UserCredential, status: 'ACTIVE' }
  }>
}
