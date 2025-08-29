import { ILike, In, LessThan, MoreThan, Equal, LessThanOrEqual, MoreThanOrEqual, Not, IsNull } from 'typeorm';
import { FilteringParam, SortingParam } from '../decorators';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '../exceptions/custom-exceptions';

export const validRules = ['eq', 'lt', 'lte', 'like', 'gt', 'gte', 'ne', 'in', 'nin', 'null', 'nnull', 'nlike'];

export const getWhereConditions = <T>(filter: FilteringParam<T> | null) => {
  if (!filter) return {};

  const { field, rule, value } = filter;

  if (!rule) return {};
  if (!value) throw new BadRequestException(`A filter value is required for the rule: ${rule}`);
  if (!field) throw new BadRequestException(`A filter field is required for the rule: ${rule}`);

  switch (rule) {
    case 'eq':
      return { [field]: Equal(value) };
    case 'lt':
      return { [field]: LessThan(value) };
    case 'lte':
      return { [field]: LessThanOrEqual(value) };
    case 'like':
      return { [field]: ILike(`%${value}%`) };
    case 'gt':
      return { [field]: MoreThan(value) };
    case 'gte':
      return { [field]: MoreThanOrEqual(value) };
    case 'ne':
      return { [field]: Not(value) };
    case 'in':
      return { [field]: In(value.split(',')) };
    case 'nin':
      return { [field]: Not(In(value.split(','))) };
    case 'null':
      return { [field]: IsNull() };
    case 'nnull':
      return { [field]: Not(IsNull()) };
    case 'nlike':
      return { [field]: Not(ILike(`%${value}%`)) };
    default:
      throw new BadRequestException(`Invalid rule: ${rule}. Valid rules are: ${validRules.join(', ')}`);
  }
};

export const getSortingOrder = <T>(sorting: SortingParam<T> | null) => {
  return sorting ? { [sorting.field]: sorting.direction } : {};
};

export const handleDBErrors = (error: any, notFoundMessage?: string) => {
  if (error instanceof NotFoundException || error instanceof BadRequestException) {
    throw error;
  }

  if (error === null || error === undefined) {
    throw new NotFoundException(notFoundMessage || 'Resource not found');
  }

  if (error.code) {
    switch (error.code) {
      case '23505': // Duplicated entry error
        throw new BadRequestException('Duplicate entry');
      case '23503': // Foreign key violation error
        throw new BadRequestException('Foreign key constraint violation');
      case '22P02': // Invalid input syntax error
        throw new BadRequestException('Invalid input syntax');
      default:
    }
  }

  throw new InternalServerErrorException('An error occurred while processing your request');
};
