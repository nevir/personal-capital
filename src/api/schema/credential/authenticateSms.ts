import { AuthorizedHeader, Response } from '../format'

export interface AuthenticateSms {
  path: 'credential/authenticateSms'

  Request: {
    bindDevice: boolean
    challengeMethod: 'OP'
    challengeReason: 'DEVICE_AUTH'
    code: string
  }

  Response: Response<AuthorizedHeader, void>
}
