import { AuthorizedHeader, Response } from '../format'

export interface QuerySession {
  path: 'login/querySession'

  Request: {}

  Response: Response<AuthorizedHeader, void>
}
