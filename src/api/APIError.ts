import { FieldError, Header } from './schema/format'

export class APIError extends Error {
  errors: FieldError[]

  constructor(message: string, public header?: Header) {
    super(`${message}: ${JSON.stringify(header?.errors)}`)

    this.errors = header?.errors || []

    // https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, APIError.prototype)
  }
}
