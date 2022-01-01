import { Operation } from './schema/operations'

export interface APIClient {
  call<TName extends keyof Operation>(
    operation: TName,
    request: Operation[TName]['Request']
  ): Promise<Operation[TName]['Response']>
}
