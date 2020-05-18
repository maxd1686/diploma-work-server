
export class BaseError extends Error {
  public status: number;
  public code: string;
  public message: string;
  public family = 'base_error';

  constructor(input: any = {}) {
    super(input.message);
    this.status = input.status;
    this.code = input.code;
    this.message = input.message;
  }

  public toJSON() {
    return JSON.stringify({
      message: this.message,
      status: this.status,
      code: this.code,
    });
  }
}

export class InternalError extends BaseError {
  constructor() {
    super({
      message: 'Something went wrong. Check yout request payload',
      code: 'internal_error',
      status: 500,
    });
  }
}

export class RouteNotFoundError extends BaseError {
  constructor() {
    super({
      message: `Route is not found`,
      code: 'route_not_found',
      status: 404,
    });
  }
}

export class InvalidTokenError extends BaseError {
  constructor() {
    super({
      message: 'Token validation failed.',
      code: 'invalid_token',
      status: 401,
    });
  }
}

export class UnauthorizedError extends BaseError {
  constructor() {
    super({
      message: 'Authorization failed.',
      code: 'unauthorized',
      status: 401,
    });
  }
}

export class UserAlreadyTakenError extends BaseError {
  constructor() {
    super({
      message: 'This user is already taken',
      code: 'conflict',
      status: 401,
    });
  }
}

export class ValidationError extends BaseError {
  constructor() {
    super({
      message: 'Payload data is not valid',
      code: 'invalid_data',
      status: 401,
    });
  }
}