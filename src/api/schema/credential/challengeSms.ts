import { UUID } from '../primitive'
import { Response, UserIdentifiedHeader } from '../format'

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
