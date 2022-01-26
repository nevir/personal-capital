import * as schema from '../api/schema/operations/transaction/getUserTransactions'
import { Day } from '../api/schema/primitive'
import { Entity } from './Entity'

/**
* A transaction record.
*/
export class Transaction extends Entity<schema.Transaction> {
  constructor(
    raw: schema.Transaction,
    public id: number,
    public date: Day,
    public accountId: number,
    public amount: number,
    public description: string,
    public fullDescription: string,
  ) {
    super(raw)
  }
}
