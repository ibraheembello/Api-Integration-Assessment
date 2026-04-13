export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true,
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Bad Request") {
    super(message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Not Found") {
    super(message, 404);
  }
}

export class UnprocessableEntityError extends AppError {
  constructor(message: string = "Unprocessable Entity") {
    super(message, 422);
  }
}

export class UpstreamError extends AppError {
  constructor(message: string = "Upstream server failure") {
    super(message, 502);
  }
}
