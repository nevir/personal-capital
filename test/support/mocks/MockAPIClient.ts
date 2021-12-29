import { APIClient, OperationName, Operation } from 'personal-capital'

export class MockAPIClient implements APIClient {
  async call<TName extends OperationName>(
    operation: TName,
    request: Operation[TName]['Request']
  ): Promise<Operation[TName]['Response']> {
    return {} as any
  }
}
