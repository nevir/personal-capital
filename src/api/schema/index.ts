import { AuthenticatePassword } from './credential/authenticatePassword'
import { IdentifyUser } from './login/identifyUser'

export type Operation =
  | AuthenticatePassword
  | IdentifyUser
