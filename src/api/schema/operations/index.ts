import { AuthenticatePassword } from './credential/authenticatePassword'
import { AuthenticateSms } from './credential/authenticateSms'
import { ChallengeSms } from './credential/challengeSms'
import { IdentifyUser } from './login/identifyUser'
import { QuerySession } from './login/querySession'
import { SuggestDeviceName } from './credential/suggestDeviceName'

export type Operations =
  | AuthenticatePassword
  | AuthenticateSms
  | ChallengeSms
  | IdentifyUser
  | QuerySession
  | SuggestDeviceName

export type OperationName = Operations['path']

export type Operation = {
  [TName in OperationName]: Extract<Operations, { path: TName }>
}
