import { AuthorizedHeader, Response } from '../../format'

export interface AuthenticateTotpCode {
  path: 'credential/authenticateTotpCode'

  Request: {
    bindDevice: boolean
    challengeMethod: 'TOTP'
    challengeReason: 'DEVICE_AUTH'
    totpCode: string
  }

  Response: Response<AuthorizedHeader, void>
}
