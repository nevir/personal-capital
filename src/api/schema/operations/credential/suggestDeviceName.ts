import { Response, AuthorizedHeader } from '../../format'

export interface SuggestDeviceName {
  path: 'credential/suggestDeviceName'

  Request: {
    bindDevice: boolean
  }

  Response: Response<AuthorizedHeader, {
    deviceName: string
  }>
}
