import { createParamDecorator, ExecutionContext, BadRequestException, applyDecorators } from '@nestjs/common';
import { Request } from 'express';
import { ApiQuery } from '@nestjs/swagger';
import { validRules } from '../helpers/typeorm-helpers';

export interface FilteringParam<T> {
  field: keyof T;
  rule: string;
  value: string;
}

// Generic ApiFilteringQuery decorator
export const ApiFilteringQuery = <T>(params: Array<keyof T>) => {
  return applyDecorators(
    ApiQuery({
      name: 'filterField',
      required: false,
      enum: params as string[], // Dropdown for filtering fields
      description: `Field to filter by. Allowed values: ${JSON.stringify(params)}`,
      type: 'string',
    }),
    ApiQuery({
      name: 'filterRule',
      required: false,
      enum: validRules, // Dropdown for filter rules
      description: `Filter rule. Allowed values: ${validRules.join(', ')}`,
      type: 'string',
    }),
    ApiQuery({
      name: 'filterValue',
      required: false,
      description: 'Value for the filter condition',
      type: 'string',
    }),
  );
};

// Generic FilteringParams decorator
export const FilteringParams = createParamDecorator(
  <T>(validFields: Array<keyof T>, ctx: ExecutionContext): FilteringParam<T> | null => {
    const req: Request = ctx.switchToHttp().getRequest();
    if (!req.query?.filterField && !req.query?.filterRule && !req.query?.filterValue) return null;

    const filterField = req.query?.filterField as keyof T;
    const filterRule = req.query?.filterRule as string;
    const filterValue = req.query?.filterValue as string;

    // Validate filterField
    if (!filterField || !validFields.includes(filterField)) {
      throw new BadRequestException(
        `Invalid filter field: ${String(filterField)} (valid fields: ${validFields.join(', ')})`,
      );
    }

    // Validate filterRule
    if (!validRules.includes(filterRule)) {
      throw new BadRequestException(`Invalid filter rule: ${filterRule} (valid rules: ${validRules.join(', ')})`);
    }

    if (!filterValue) {
      throw new BadRequestException('Filter value is required when you provide filterField and filterRule');
    }

    return { field: filterField, rule: filterRule, value: filterValue };
  },
);
