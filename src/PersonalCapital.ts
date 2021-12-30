import { APIClient, Operation, OperationName, RawAPIClient } from '.'
import { CookieJar } from './api/dependencies/cookieJar'
import { Fetch } from './api/dependencies/fetch'

export enum ChallengeType {
  EMAIL = 'OOB_EMAIL',
  PHONE = 'OOB_PHONE',
  SMS = 'OOB_SMS',
  TOTP = 'OOB_TOTP',
  // TODO: TOTP Push in additon to code
}

export type CodeChallengeType =
  | ChallengeType.EMAIL
  | ChallengeType.SMS
  | ChallengeType.TOTP

const OPERATION_BY_CHALLENGE_TYPE = {
  [ChallengeType.EMAIL]: 'credential/challengeEmail',
  [ChallengeType.PHONE]: 'credential/challengePhone',
  [ChallengeType.SMS]: 'credential/challengeSms',
  [ChallengeType.TOTP]: 'credential/challengeTotp',
} as const

const AUTHENTICATE_CODE_OPERATION_BY_CHALLENGE_TYPE = {
  [ChallengeType.EMAIL]: 'credential/authenticateEmailByCode',
  [ChallengeType.SMS]: 'credential/authenticateSms',
  [ChallengeType.TOTP]: 'credential/authenticateTotpCode',
} as const

export interface Login {
  username: string
  password: string
  kind: CodeChallengeType
  code: () => Promise<string>
}

/**
 * Client for the Personal Capital API.
 */
export class PersonalCapital {
  private _api: APIClient

  constructor(cookieJar: CookieJar, fetch?: Fetch, options?: Partial<RawAPIClient.Options>)
  constructor(api: APIClient)
  constructor(cookieJarOrApi: CookieJar | APIClient, fetch?: Fetch, options?: Partial<RawAPIClient.Options>) {
    if (isCookieJar(cookieJarOrApi)) {
      this._api = new RawAPIClient(cookieJarOrApi, fetch, options)
    } else {
      this._api = cookieJarOrApi
    }
  }

  async login({ username, password, kind, code }: Login): Promise<void> {
    await this.identifyUser(username)
    // TODO: Verify the challenge method is allowed via credentials
    await this.challenge(kind)
    await this.authenticateCode(kind, await code())
    await this.authenticatePassword(username, password)
  }

  // Specific API Calls

  async identifyUser(username: string) {
    const response = await this._api.call('login/identifyUser', {
      bindDevice: false, // TODO: remove?
      username,
      redirectTo: '',
      referrerId: '',
      skipFirstUse: '',
      skipLinkAccount: false,
    })

    return response.spData
  }

  async challenge(kind: ChallengeType) {
    const operation = OPERATION_BY_CHALLENGE_TYPE[kind]
    await this._api.call(operation, {
      challengeReason: 'DEVICE_AUTH',
      challengeMethod: kind === ChallengeType.TOTP ? 'TP' : 'OP',
      bindDevice: false, // TODO: remove?
    })
  }

  async authenticateCode(kind: CodeChallengeType, code: string) {
    const operation = AUTHENTICATE_CODE_OPERATION_BY_CHALLENGE_TYPE[kind]
    const base = { challengeReason: 'DEVICE_AUTH', bindDevice: false } as const

    if (kind === ChallengeType.TOTP) {
      await this._api.call(operation, { ...base, challengeMethod: 'TOTP', totpCode: code })
    } else {
      await this._api.call(operation, { ...base, challengeMethod: 'OP', code })
    }
  }

  async authenticatePassword(username: string, password: string, deviceName?: string) {
    await this._api.call('credential/authenticatePassword', {
      username,
      passwd: password,
      deviceName: deviceName || '',
      bindDevice: !!deviceName,
      redirectTo: '',
      skipFirstUse: '',
      skipLinkAccount: false,
      referrerId: '',
    })
  }

  async querySession() {
    const { spHeader } = await this._api.call('login/querySession', {})
    return spHeader
  }
}

function isCookieJar(value: any): value is CookieJar {
  return typeof value?.setCookie === 'function'
}
