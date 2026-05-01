export class NotFoundError extends Error {
  statusCode = 404;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class UnauthorizedError extends Error {
  statusCode = 401;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class ForbiddenError extends Error {
  statusCode = 403;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}
