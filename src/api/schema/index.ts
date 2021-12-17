import { AuthenticatePassword } from './credential/authenticatePassword'
import { ChallengeSms } from './credential/challengeSms'
import { IdentifyUser } from './login/identifyUser'

export type Operations =
  | AuthenticatePassword
  | ChallengeSms
  | IdentifyUser

export type OperationName = Operations['path']

export type Operation<TName extends OperationName> = Extract<Operations, { path: TName }>
