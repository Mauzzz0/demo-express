export class UnauthorizedException extends Error {
  public readonly code = 401;

  constructor(message: string = 'Session is not authorized') {
    super(message);
  }
}
