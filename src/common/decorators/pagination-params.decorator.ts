import { ExecutionContext, NotAcceptableException, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export interface PaginationParam {
  page: number;
  limit: number;
  offset?: number;
}

export const ApiPaginationQuery = () => {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      description: 'Current page number for pagination',
      type: 'integer',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: 'Number of items per page',
      type: 'integer',
      example: 10,
    }),
    ApiQuery({
      name: 'offset',
      required: false,
      description: 'Offset for pagination (overrides page and limit)',
      type: 'integer',
      example: 0,
    }),
  );
};

export const PaginationParams = createParamDecorator((data: unknown, ctx: ExecutionContext): PaginationParam => {
  const req: Request = ctx.switchToHttp().getRequest();
  const page = parseInt(req.query.page as string, 10) || 1; // Default to page 1
  const limit = parseInt(req.query.limit as string, 10) || 10; // Default to 10 items per page
  const offset = parseInt(req.query.offset as string, 10) || (page - 1) * limit; // Calculate offset if not provided

  if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1 || isNaN(offset) || offset < 0) {
    throw new NotAcceptableException('Invalid pagination parameters');
  }

  return { page, limit, offset };
});
