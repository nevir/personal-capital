import { AuthenticatePassword } from './credential/authenticatePassword'
import { AuthenticateSms } from './credential/authenticateSms'
import { ChallengeSms } from './credential/challengeSms'
import { IdentifyUser } from './login/identifyUser'

export type Operations =
  | AuthenticatePassword
  | AuthenticateSms
  | ChallengeSms
  | IdentifyUser

export type OperationName = Operations['path']

export type Operation<TName extends OperationName> = Extract<Operations, { path: TName }>
