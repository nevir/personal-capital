import { Currency } from '../../enums'
import { AuthenticatedHeader, Response } from '../../format'
import { Day } from '../../primitive'

export type TransactionTabs =
  | 'cashflow'

export type TransactionIntervalType =
  | 'MONTH'

export type TransactionStatus =
  | 'posted'

export interface Transaction {
  isInterest: boolean
  accountName: string
  description: string
  transactionAvailableDate: string
  isCredit: boolean
  transactionSubType: TransactionAPISubType
  isEditable: boolean
  isCashOut: boolean
  merchantId: string
  requestId: string
  apiResponse: TransactionAPIResponse
  userTransactionId: number
  currency: Currency
  isDuplicate: boolean
  transactionSchedule: string
  originalDescription: string
  isSpending: boolean
  amount: number
  checkNumber: string
  transactionTypeId: number
  isIncome: boolean
  transactionStatus: TransactionAPIStatus
  includeInCashManager: boolean
  isNew: boolean
  isCashIn: boolean
  transactionDate: Day
  transactionVoidDate: Day | ''
  transactionType: TransactionAPIType
  accountId: string
  // Format is a wat. MM-DD-YYYY-MM-DD
  transactionEffectiveDate: string
  isCost: boolean
  userAccountId: number
  runningBalance: number
  hasViewed: boolean
  categoryId: number
  status: TransactionStatus
}

export type TransactionAPIIdentifierType =
  | 'TraceNumber'
  | 'ReferenceNumber'

export type TransactionAPIType =
  | 'Debit'

export type TransactionAPISubType =
  | 'AchWithdrawal'

export type TransactionAPIStatus =
  | 'Posted'

export interface TransactionAPIValue<TValue> {
  Value: TValue
}

export interface TransactionAPICurrencyAmount {
  CurrencyCode: Currency
  CurrencyValue: number
}

export interface TransactionAPIResponse {
  TransactionId: {
    Id: string
    IdentifierType: TransactionAPIIdentifierType
    SecondaryIdentifiers: {
      Id: string
      IdentifierType: TransactionAPIIdentifierType
    }[]
  }
  TransactionType: TransactionAPIType
  TransactionSubType: TransactionAPISubType
  TransactionDescription: string
  TransactionStatus: TransactionAPIStatus
  TransactionCode: string // number
  TransactionSchedule: {
    CompletedDate: Day
  }
  TransactionAccount: {
    AccountProduct: {
      ProductCode: string
    }
    AccountNumber: TransactionAPIValue<string>
    AccountRoutingNumber: TransactionAPIValue<string>
    AccountBranch: {
      Bank: {
        BankNumber: string
      }
    }
  }
  TransactionAmount: TransactionAPICurrencyAmount
  RunningBalanceAmount: {
    BalanceAmount: TransactionAPICurrencyAmount
  }
  TransactionEffectiveDate: Day
  TransactionCheckNumber: string
}

export interface GetUserTransactions {
  path: 'transaction/getUserTransactions'

  Request: {
    startDate: Day
    endDate: Day
    // JSON array of account ids
    userAccountIds?: string
    // The UX tab the transactions are being displayed for.
    tabId?: TransactionTabs
  }

  Response: Response<AuthenticatedHeader, {
    intervalType: TransactionIntervalType
    startDate: Day
    endDate: Day
    netCashflow: number
    moneyIn: number
    moneyOut: number
    averageIn: number
    averageOut: number
    transactions: Transaction[]
  }>
}
