import { ExecutionContext, NotAcceptableException, createParamDecorator, applyDecorators } from '@nestjs/common';
import { Request } from 'express';
import { ApiQuery } from '@nestjs/swagger';

const validDirections = ['ASC', 'DESC'];

export interface SortingParam<T> {
  field: keyof T;
  direction: string;
}

// Generic ApiSortingQuery decorator
export const ApiSortingQuery = <T>(params: Array<keyof T>) => {
  return applyDecorators(
    ApiQuery({
      name: 'sortField',
      required: false,
      enum: params as string[], // Dropdown for sorting fields
      description: `Field to sort by. Allowed values: ${JSON.stringify(params)}`,
      type: 'string',
    }),
    ApiQuery({
      name: 'sortOrder',
      required: false,
      enum: validDirections, // Dropdown for sort directions
      description: `Sort direction. Allowed values: ASC or DESC`,
      type: 'string',
      example: 'ASC',
    }),
  );
};

// Generic SortingParams decorator
export const SortingParams = createParamDecorator(
  <T>(validFields: Array<keyof T>, ctx: ExecutionContext): SortingParam<T> | null => {
    const req: Request = ctx.switchToHttp().getRequest();
    if (!req.query?.sortField && !req.query?.sortOrder) return null;

    const sortField = req.query?.sortField as keyof T;
    const sortOrder = (req.query?.sortOrder as string) || 'ASC'; // Default to 'ASC' if not provided

    // Check if the sortField is valid
    if (!sortField || !validFields.includes(sortField)) {
      throw new NotAcceptableException(
        `Invalid sort field: ${String(sortField)} (valid fields: ${validFields.join(', ')})`,
      );
    }

    // Check if the sortOrder is valid
    if (!validDirections.includes(sortOrder)) {
      throw new NotAcceptableException(
        `Invalid sort direction: ${sortOrder} (valid directions: ${validDirections.join(', ')})`,
      );
    }

    return { field: sortField, direction: sortOrder };
  },
);
