// src/common/exceptions/custom-exceptions.ts

import { HttpException, HttpStatus } from '@nestjs/common';

export class HandlerException extends HttpException {
  constructor(message: string, status: HttpStatus, title = '') {
    super({ message, title }, status);
  }
}

export class BadRequestException extends HandlerException {
  constructor(message: string, title = '') {
    super(message, HttpStatus.BAD_REQUEST, title);
  }
}

export class UnauthorizedException extends HandlerException {
  constructor(message: string, title = '') {
    super(message, HttpStatus.UNAUTHORIZED, title);
  }
}

export class ForbiddenException extends HandlerException {
  constructor(message: string, title = '') {
    super(message, HttpStatus.FORBIDDEN, title);
  }
}

export class NotFoundException extends HandlerException {
  constructor(message: string, title = '') {
    super(message, HttpStatus.NOT_FOUND, title);
  }
}

export class InternalServerErrorException extends HandlerException {
  constructor(message: string, title = '') {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, title);
  }
}

// Add other custom exceptions as needed
