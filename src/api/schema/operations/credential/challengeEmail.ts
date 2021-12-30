import { Response, UserIdentifiedHeader } from '../../format'

export interface ChallengeEmail {
  path: 'credential/challengeEmail'

  Request: {
    bindDevice: boolean
    challengeMethod: 'OP'
    challengeReason: 'DEVICE_AUTH'
  }

  Response: Response<UserIdentifiedHeader, void>
}
