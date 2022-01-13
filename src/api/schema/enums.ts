/** The kind of client making requests. */
export type ClientType =
  | 'WEB'

/** The session's current state in the authorization workflow. */
export type AuthenticationLevel =
  | 'DEVICE_AUTHORIZED'
  | 'MFA_REQUIRED'
  | 'NONE'
  | 'SESSION_AUTHENTICATED'
  | 'USER_IDENTIFIED'
  | 'USER_REMEMBERED'

/** A user's high level status. */
export type UserStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'LOCKED'
  | 'PARTIAL_ENROLLMENT'
  | 'REQUIRES_VERIFICATION'

/** Potential credential types that are supported. */
export type UserCredential =
  | 'DEVICE'
  | 'OOB_EMAIL'
  | 'OOB_PHONE'
  | 'OOB_SMS'
  | 'OOB_TOTP'
  | 'PASSWORD_RESET'
  | 'PASSWORD'
  | 'PIN'
  | 'SITE_KNOWLEDGE'

/** Flags indicating which specific functionality is enabled. */
export type AccountMetaData =
  | 'HAS_CASH'
  | 'HAS_CREDIT'
  | 'HAS_INVESTMENT'
  | 'HAS_ON_US'

/** A kind of server data change */
export type ServerDataChangeType =
  | 'PERSON_UPDATED'

/** A financial currency. */
export type Currency =
  | 'USD'
