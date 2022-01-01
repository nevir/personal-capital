import { APIClient } from '../api/APIClient'
import { Operation } from '../api/schema/operations'

export abstract class API {
  protected abstract raw: APIClient

  /**
   * Calls an operation on the Personal Capital API.
   */
  async call<TName extends keyof Operation>(
    operation: TName,
    request: Operation[TName]['Request']
  ): Promise<Operation[TName]['Response']['spData']> {
    const { spData } = await this.raw.call(operation, request)

    return spData
  }
}
