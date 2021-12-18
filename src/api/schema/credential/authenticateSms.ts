import { UUID } from '../primitive'
import { AuthorizedHeader, Response } from '../Response'

export interface AuthenticateSms {
  path: 'credential/authenticateSms'

  Request: {
    apiClient: 'WEB'
    bindDevice: boolean
    challengeMethod: 'OP'
    challengeReason: 'DEVICE_AUTH'
    code: string
    csrf: UUID
  }

  Response: Response<AuthorizedHeader, void>
}
