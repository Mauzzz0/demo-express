export class TooManyRequestsException extends Error {
  public readonly code = 429;

  constructor(message = 'Too Many Requests') {
    super(message);
  }
}
