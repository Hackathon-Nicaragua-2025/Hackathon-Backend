import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponseDto } from '../dto/api-response.dto';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  // Logger to log exception details.
  private readonly logger = new Logger(AllExceptionsFilter.name);

  /**
   * Method that captures exceptions and returns an HTTP response
   * with a predefined format.
   *
   * @param exception - The captured exception (can be of any type).
   * @param host - The execution context containing details about the request and response.
   */
  catch(exception: unknown, host: ArgumentsHost) {
    // Get the HTTP request context.
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message = '';
    let title = '';

    // If the exception is an HttpException, handle specific details.
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseObj = exception.getResponse();

      // // Check if the exception response is an object to extract title and message.
      if (typeof responseObj === 'object') {
        const { message: msg, title: ttl } = responseObj as any;
        message = Array.isArray(msg) ? msg.join(', ') : msg;
        title = ttl || '';
      } else {
        // If the response is a string, use it as the message.
        message = responseObj as string;
      }
    } else {
      // If it is not an HttpException, assign status 500 (Internal Server Error).
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
    }

    //  Log the error.
    this.logger.error(
      `HTTP Status: ${status} Error Message: ${message} Path: ${request.url}`,
      exception instanceof Error ? exception.stack : '',
    );

    console.log('Error message:', exception);

    // Create an error response object.
    const errorResponse = ApiResponseDto.Failure(message, title);

    // Send the response in JSON format with the corresponding HTTP status.
    response.status(status).json(errorResponse);
  }
}
