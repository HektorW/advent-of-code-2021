export class AppError {
  public message: string

  constructor(message: unknown) {
    if (typeof message === 'string') {
      this.message = message
    } else if (
      typeof message === 'object' &&
      message !== null &&
      'message' in message &&
      typeof (message as { message: unknown }).message === 'string'
    ) {
      this.message = (message as { message: string }).message
    } else {
      this.message = 'unkown error'
    }
  }
}

export class ParsingError extends AppError {}

export class CalculationError extends AppError {}
