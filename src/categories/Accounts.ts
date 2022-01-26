import { Account } from '../entities/Account'
import { API } from './API'

/**
 * Account related calls for the Personal Capital API.
 */
export abstract class Accounts extends API {
  async getAccounts() {
    const { accounts } = await this.call('newaccount/getAccounts2', {})

    return accounts.map(a => new Account(
      a,
      a.userAccountId,
      a.name,
      a.accountTypeNew,
      a.productType,
    ))
  }
}
