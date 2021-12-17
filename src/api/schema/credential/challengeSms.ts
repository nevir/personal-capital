import { UUID } from '../primitive'
import { Response, UserIdentifiedHeader } from '../Response'

export interface ChallengeSms {
  path: 'credential/challengeSms'

  Request: {
    apiClient: 'WEB'
    bindDevice: boolean
    challengeMethod: 'OP'
    challengeReason: 'DEVICE_AUTH'
    csrf: UUID
  }

  Response: Response<UserIdentifiedHeader, void>
}
