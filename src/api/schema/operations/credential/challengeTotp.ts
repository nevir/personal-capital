import { Response, UserIdentifiedHeader } from '../../format'

export interface ChallengeTotp {
  path: 'credential/challengeTotp'

  Request: {
    bindDevice: boolean
    challengeMethod: 'TP'
    challengeReason: 'DEVICE_AUTH'
  }

  Response: Response<UserIdentifiedHeader, void>
}
