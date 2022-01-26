import { Currency } from '../../enums'
import { AuthenticatedHeader, Response } from '../../format'
import { Timestamp, URL, URLPath } from '../../primitive'

export type AccountTypeOld =
  | 'Personal'

export type AccountType =
  | '401K'
  | 'CHECKING'
  | 'ESOP'
  | 'INVESTMENT'
  | 'IRA'
  | 'MMA'
  | 'MORTGAGE'
  | 'PERSONAL'
  | 'SAVINGS'

export type AccountTypeSubtype =
  | 'TRADITIONAL'
  | 'ROLLOVER'

export type AccountTypeGroup =
  | 'CREDIT_CARD'
  | 'RETIREMENT'
  | 'MORTGAGE'
  | 'BANK'
  | 'INVESTMENT'
  | 'ESOP'
  | ''

export type AccountAggregationErrorType =
  | 'ACCOUNT_NOT_FOUND'
  | 'AGENT_ERROR'
  | 'MFA_REQUIRED'
  | 'NO_ERROR'
  | 'PERSISTENT_ERROR'

export type AccountAggregationErrorTags =
  | 'UAR'
  | 'MFA_REQUIRED'

export type AccountInfoSource =
  | 'YODLEE'

export interface AccountAggregationError {
  type: AccountAggregationErrorType
  tags: AccountAggregationErrorTags[]
}

export interface AccountContactInfo {
  url: URL
}

export interface AccountLoginField {
  hint: string
  isRequired: boolean
  isUsername: boolean
  label: string
  parts: AccountLoginFieldPart[]
}

export type AccountLoginFieldPartMask =
  | 'LOGIN_FIELD'

export type AccountLoginFieldPartType =
  | 'TEXT'
  | 'PASSWORD'

export interface AccountLoginFieldPart {
  id: string
  mask: AccountLoginFieldPartMask
  maxLength: number
  name: string
  size: number
  type: AccountLoginFieldPartType
}

export type AccountMFAType =
  | 'SECURITY_QUESTION'

export type AccountNextActionType =
  | 'NONE'
  | 'INITIATE_REFRESH'

export type AccountNextActionIconType =
  | 'NONE'
  | 'SUCCESS'
  | 'WARNING'
  | 'ERROR'

export type AccountNextActionReportActionType =
  | 'NONE'

export interface AccountNextAction {
  action: AccountNextActionType
  aggregationErrorType: AccountAggregationErrorType
  iconType: AccountNextActionIconType
  nextActionMessage: string
  prompts: []
  reportAction: AccountNextActionReportActionType
  statusMessage: string
}

export type AccountProductType =
  | 'BANK'
  | 'CREDIT_CARD'
  | 'INVESTMENT'
  | 'LOAN'
  | 'MORTGAGE'
  | 'OTHER_ASSETS'

export type AccountPropertyType =
  | 'INVESTMENT_PROPERTY'
  | 'PRIMARY_RESIDENCE'

export type AccountRoutingNumberSource =
  | 'ENROLLMENT'
  | 'YODLEE_AGGREGATION'
  | 'YODLEE_IAV'

export interface Account {
  accountHolder: string
  accountId: string
  accountName: string
  accountType: AccountTypeOld
  accountTypeSubtype?: AccountTypeSubtype
  accountTypeGroup: AccountTypeGroup
  accountTypeNew: AccountType
  advisoryFeePercentage: number
  aggregating: boolean
  aggregationError: AccountAggregationError
  amountDue: 'NaN'
  apr: number
  availableCredit: number
  balance: number
  closedComment: string
  closedDate: string
  contactInfo: AccountContactInfo
  createdDate: Timestamp
  creditLimit: string
  creditUtilization: number
  currency: Currency
  currentBalance: number
  dueDate: Timestamp
  enrollmentConciergeRequested: number
  excludeFromProposal: boolean
  firmName: string
  homeUrl: URL
  infoSource: AccountInfoSource
  is365DayTransactionEligible: boolean
  is401KEligible: boolean
  isAccountNumberValidated: boolean
  isAccountUsedInFunding: boolean
  isAsset: boolean
  isCrypto: boolean
  isCustomManual: boolean
  isEsog: boolean
  isExcludeFromHousehold: boolean
  isHome: boolean
  isIAVAccountNumberValid: boolean
  isIAVEligible: boolean
  isLiability: boolean
  isManual: boolean
  isManualPortfolio: boolean
  isOAuth: boolean
  isOnUs: boolean
  isOnUs401K: boolean
  isOnUsBank: boolean
  isOnUsRetirement: boolean
  isPartner: boolean
  isPaymentFromCapable: boolean
  isPaymentToCapable: boolean
  isRefetchTransactionEligible: boolean
  isRoutingNumberValidated: boolean
  isSelectedForTransfer: boolean
  isStatementDownloadEligible: boolean
  isTaxDeferredOrNonTaxable: boolean
  isTransferEligible: boolean
  lastPayment: number
  lastPaymentAmount: 'NaN'
  lastPaymentDate: Timestamp
  lastRefreshed: Timestamp
  link: URLPath
  loginFields: AccountLoginField[]
  loginUrl: URL
  memo: string
  mfaType: "SECURITY_QUESTION"
  minPaymentDue: 'NaN'
  name: string
  nextAction: AccountNextAction
  originalFirmName: string
  originalName: string
  paymentFromStatus: boolean
  paymentToStatus: boolean
  productId: number
  productType: AccountProductType
  propertyType?: AccountPropertyType
  routingNumber?: string
  routingNumberSource?: AccountRoutingNumberSource
  runningBalance: number
  siteId: number
  userAccountId: number
  userProductId: number
  userSiteId: number
}

export interface GetAccounts2 {
  path: 'newaccount/getAccounts2'

  Request: {}

  Response: Response<AuthenticatedHeader, {
    accounts: Account[]
    assets: number
    cashAccountsTotal: number
    creditCardAccountsTotal: number
    investmentAccountsTotal: number
    liabilities: number
    loanAccountsTotal: number
    mortgageAccountsTotal: number
    networth: number
    otherAssetAccountsTotal: number
    otherLiabilitiesAccountsTotal: number
  }>
}
