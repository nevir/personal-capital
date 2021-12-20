import { FieldError, Response } from './schema/format'

export class APIError extends Error {
  errors: FieldError[]

  constructor(message: string, public response: Response) {
    super(`${message}: ${JSON.stringify(response.spHeader?.errors)}`)

    this.errors = response.spHeader?.errors || []

    // https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, APIError.prototype)
  }
}
