import { AuthenticatePassword } from './credential/authenticatePassword'
import { AuthenticateSms } from './credential/authenticateSms'
import { ChallengeSms } from './credential/challengeSms'
import { IdentifyUser } from './login/identifyUser'
import { QuerySession } from './login/querySession'
import { SuggestDeviceName } from './credential/suggestDeviceName'
import { ChallengeEmail } from './credential/challengeEmail'
import { ChallengePhone } from './credential/challengePhone'
import { ChallengeTotp } from './credential/challengeTotp'
import { AuthenticateEmailByCode } from './credential/authenticateEmailByCode'
import { AuthenticateTotpCode } from './credential/authenticateTotpCode'

export type Operations =
  | AuthenticateEmailByCode
  | AuthenticatePassword
  | AuthenticateSms
  | AuthenticateTotpCode
  | ChallengeEmail
  | ChallengePhone
  | ChallengeSms
  | ChallengeTotp
  | IdentifyUser
  | QuerySession
  | SuggestDeviceName

export type OperationName = Operations['path']

export type Operation = {
  [TName in OperationName]: Extract<Operations, { path: TName }>
}
