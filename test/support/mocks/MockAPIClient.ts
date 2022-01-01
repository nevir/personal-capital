import { APIClient, Operation } from 'personal-capital'

export class MockAPIClient implements APIClient {
  async call<TName extends keyof Operation>(
    operation: TName,
    request: Operation[TName]['Request']
  ): Promise<Operation[TName]['Response']> {
    return {} as any
  }
}
