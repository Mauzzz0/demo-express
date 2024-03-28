export class BadRequestException extends Error {
  public readonly code = 400;

  constructor(message: string) {
    super(message);
  }
}
