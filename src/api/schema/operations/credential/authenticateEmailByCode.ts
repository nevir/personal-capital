import { AuthorizedHeader, Response } from '../../format'

export interface AuthenticateEmailByCode {
  path: 'credential/authenticateEmailByCode'

  Request: {
    bindDevice: boolean
    challengeMethod: 'OP'
    challengeReason: 'DEVICE_AUTH'
    code: string
  }

  Response: Response<AuthorizedHeader, void>
}
