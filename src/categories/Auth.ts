import { AuthenticationLevel } from '../api/schema/enums'
import { API } from './API'

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
  deviceName?: string
  kind: CodeChallengeType
  code: () => Promise<string>
}

const NEEDS_2FA = new Set<AuthenticationLevel>([
  'USER_IDENTIFIED',
  'MFA_REQUIRED',
  'NONE',
])

/**
 * Authentication related calls for the Personal Capital API.
 */
export abstract class Auth extends API {
  async login({ username, password, kind, code, deviceName }: Login): Promise<void> {
    await this.identifyUser(username)

    if (NEEDS_2FA.has(this.session.authenticationLevel)) {
      // TODO: Verify the challenge method is allowed via credentials
      await this.challenge(kind)
      await this.authenticateCode(kind, await code())
    }

    if (this.session.authenticationLevel !== 'SESSION_AUTHENTICATED') {
      await this.authenticatePassword(username, password, deviceName)
    }
  }

  // Specific API Calls

  async identifyUser(username: string) {
    const response = await this.call('login/identifyUser', {
      bindDevice: false, // TODO: remove?
      username,
      redirectTo: '',
      referrerId: '',
      skipFirstUse: '',
      skipLinkAccount: false,
    })

    return response
  }

  async challenge(kind: ChallengeType) {
    const operation = OPERATION_BY_CHALLENGE_TYPE[kind]
    await this.call(operation, {
      challengeReason: 'DEVICE_AUTH',
      challengeMethod: kind === ChallengeType.TOTP ? 'TP' : 'OP',
      bindDevice: false, // TODO: remove?
    })
  }

  async authenticateCode(kind: CodeChallengeType, code: string) {
    const operation = AUTHENTICATE_CODE_OPERATION_BY_CHALLENGE_TYPE[kind]
    const base = { challengeReason: 'DEVICE_AUTH', bindDevice: false } as const

    if (kind === ChallengeType.TOTP) {
      await this.call(operation, { ...base, challengeMethod: 'TOTP', totpCode: code })
    } else {
      await this.call(operation, { ...base, challengeMethod: 'OP', code })
    }
  }

  async authenticatePassword(username: string, password: string, deviceName?: string) {
    await this.call('credential/authenticatePassword', {
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
}
