export class NotFoundException extends Error {
  public readonly code = 404;

  constructor(message: string) {
    super(message);
  }
}
