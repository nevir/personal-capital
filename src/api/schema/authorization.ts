/** The session's current state in the authorization workflow. */
export type AuthenticationLevel =
  | 'DEVICE_AUTHORIZED'
  | 'NONE'
  | 'SESSION_AUTHENTICATED'
  | 'USER_IDENTIFIED'
  | 'USER_REMEMBERED'

/** A user's high level status. */
export type UserStatus =
  | 'ACTIVE'

/** Potential credential types that are supported. */
export type UserCredential =
  | 'OOB_PHONE'
  | 'DEVICE'
  | 'OOB_EMAIL'
  | 'OOB_SMS'
  | 'PIN'
  | 'SITE_KNOWLEDGE'
  | 'PASSWORD'
  | 'PASSWORD_RESET'
