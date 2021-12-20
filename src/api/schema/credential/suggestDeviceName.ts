import { UUID } from '../primitive'
import { Response, AuthorizedHeader } from '../format'

export interface SuggestDeviceName {
  path: 'credential/suggestDeviceName'

  Request: {
    apiClient: 'WEB'
    bindDevice: boolean
    csrf: UUID
  }

  Response: Response<AuthorizedHeader, {
    deviceName: string
  }>
}
