import { AuthenticatePassword } from './credential/authenticatePassword'
import { IdentifyUser } from './login/identifyUser'

export type Operations =
  | AuthenticatePassword
  | IdentifyUser

export type OperationName = Operations['path']

export type Operation<TName extends OperationName> = Extract<Operations, { path: TName }>
