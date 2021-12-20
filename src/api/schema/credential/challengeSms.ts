import { Response, UserIdentifiedHeader } from '../format'

export interface ChallengeSms {
  path: 'credential/challengeSms'

  Request: {
    bindDevice: boolean
    challengeMethod: 'OP'
    challengeReason: 'DEVICE_AUTH'
  }

  Response: Response<UserIdentifiedHeader, void>
}
