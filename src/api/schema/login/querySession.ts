import { UUID } from '../primitive'
import { AuthorizedHeader, Response } from '../format'

export interface QuerySession {
  path: 'login/querySession'

  Request: {
    apiClient: 'WEB'
    csrf: UUID
    lastServerChangeId: number
  }

  Response: Response<AuthorizedHeader, void>
}
