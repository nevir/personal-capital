import { Operation } from '../api/schema/operations'
import { Transaction } from '../entities/Transaction'
import { toDay } from '../utility/time'
import { API } from './API'

/**
 * Transaction related calls for the Personal Capital API.
 */
export abstract class Transactions extends API {
  async getTransactions(startDate: Date, endDate: Date, accounts?: number[]) {
    const request: Operation['transaction/getUserTransactions']['Request'] = {
      startDate: toDay(startDate),
      endDate: toDay(endDate),
    }

    if (accounts) {
      request.userAccountIds = JSON.stringify(accounts)
    }

    const { transactions } = await this.call('transaction/getUserTransactions', request)

    return transactions.map(t => new Transaction(
      t,
      t.userTransactionId,
      t.transactionDate,
      t.userAccountId,
      t.amount,
      t.description,
      t.originalDescription,
    ))
  }
}
