import * as schema from '../api/schema/operations/newaccount/getAccounts2'
import { Entity } from './Entity'

/**
 * Account categories; following the same grouping as the Personal Capital UI.
 */
export type AccountCategory =
  | 'BANK'
  | 'CREDIT_CARD'
  | 'INVESTMENT'
  | 'LOAN'
  | 'MORTGAGE'
  | 'OTHER_ASSETS'

/**
* An account or asset that is tracked by Personal Capital.
*/
export class Account extends Entity<schema.Account> {
  constructor(
    raw: schema.Account,
    public id: number,
    public name: string,
    public type: schema.AccountType,
    public category: AccountCategory,
  ) {
    super(raw)
  }
}
