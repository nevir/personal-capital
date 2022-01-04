import { APIClient } from 'personal-capital'

export class MockAPIClient implements APIClient {
  call: jest.MockedFunction<APIClient['call']> = jest.fn()
  getInitialCsrfToken: jest.MockedFunction<APIClient['getInitialCsrfToken']> = jest.fn()

  constructor() {
    this.resetMocks()
  }

  resetMocks() {
    this.call.mockReset()
    this.call.mockResolvedValue({
      spHeader: {
        success: true,
      },
      spData: {}
    })

    this.getInitialCsrfToken.mockReset()
    this.getInitialCsrfToken
      .mockResolvedValue('initial-csrf-token')
  }
}
