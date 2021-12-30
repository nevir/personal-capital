import { Response, UserIdentifiedHeader } from '../../format'

export interface ChallengePhone {
  path: 'credential/challengePhone'

  Request: {
    bindDevice: boolean
    challengeMethod: 'OP'
    challengeReason: 'DEVICE_AUTH'
  }

  Response: Response<UserIdentifiedHeader, void>
}
