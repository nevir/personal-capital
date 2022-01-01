import { Operation } from '../api/schema/operations'

export abstract class CategoryBase {
  abstract call<TName extends keyof Operation>(
    operation: TName,
    request: Operation[TName]['Request']
  ): Promise<Operation[TName]['Response']['spData']>
}
