import { AuthenticateEmailByCode } from './credential/authenticateEmailByCode'
import { AuthenticatePassword } from './credential/authenticatePassword'
import { AuthenticateSms } from './credential/authenticateSms'
import { AuthenticateTotpCode } from './credential/authenticateTotpCode'
import { ChallengeEmail } from './credential/challengeEmail'
import { ChallengePhone } from './credential/challengePhone'
import { ChallengeSms } from './credential/challengeSms'
import { ChallengeTotp } from './credential/challengeTotp'
import { GetUserTransactions } from './transaction/getUserTransactions'
import { IdentifyUser } from './login/identifyUser'
import { QuerySession } from './login/querySession'
import { SuggestDeviceName } from './credential/suggestDeviceName'
import { GetAccounts2 } from './newaccount/getAccounts2'

export type Operations =
  | AuthenticateEmailByCode
  | AuthenticatePassword
  | AuthenticateSms
  | AuthenticateTotpCode
  | ChallengeEmail
  | ChallengePhone
  | ChallengeSms
  | ChallengeTotp
  | GetAccounts2
  | GetUserTransactions
  | IdentifyUser
  | QuerySession
  | SuggestDeviceName

export type Operation = {
  [TName in Operations['path']]: Extract<Operations, { path: TName }>
}
