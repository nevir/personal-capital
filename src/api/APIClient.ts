import { Operation, OperationName } from './schema/operations'

export interface APIClient {
  call<TName extends OperationName>(
    operation: TName,
    request: Operation[TName]['Request']
  ): Promise<Operation[TName]['Response']>
}
