export class UnauthorizedException extends Error {
  public readonly code = 401;

  constructor(message: string = 'Not authorized') {
    super(message);
  }
}
