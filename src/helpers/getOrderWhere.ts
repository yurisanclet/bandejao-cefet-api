/* eslint-disable prettier/prettier */
import {
  IsNull,
  Not,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  ILike,
  In,
} from 'typeorm';

import { Filtering } from './decorators/filteringParam.decorator';
import { Sorting } from './decorators/sortParam.decorator';
import { FilterRule } from './decorators/filteringParam.decorator';

export const getOrder = (sort: Sorting) =>
  sort ? { [sort.property]: sort.direction } : {};

export const getWhere = (filters: Filtering[]) => {
  const where = {};

  if(filters){

    filters.forEach(filter => {
      switch (filter.rule) {
        case FilterRule.EQUALS:
          where[filter.property] = filter.value;
          break;
        case FilterRule.NOT_EQUALS:
          where[filter.property] = Not(filter.value);
          break;
        case FilterRule.GREATER_THAN:
          where[filter.property] = MoreThan(filter.value);
          break;
        case FilterRule.GREATER_THAN_OR_EQUALS:
          where[filter.property] = MoreThanOrEqual(filter.value);
          break;
        case FilterRule.LESS_THAN:
          where[filter.property] = LessThan(filter.value);
          break;
        case FilterRule.LESS_THAN_OR_EQUALS:
          where[filter.property] = LessThanOrEqual(filter.value);
          break;
        case FilterRule.LIKE:
          where[filter.property] = ILike(`%${filter.value}%`);
          break;
        case FilterRule.NOT_LIKE:
          where[filter.property] = Not(ILike(`%${filter.value}%`));
          break;
        case FilterRule.IN:
          where[filter.property] = In(filter.value.split(','));
          break;
        case FilterRule.NOT_IN:
          where[filter.property] = Not(In(filter.value.split(',')));
          break;
        case FilterRule.IS_NULL:
          where[filter.property] = IsNull();
          break;
        case FilterRule.IS_NOT_NULL:
          where[filter.property] = Not(IsNull());
          break;
      }
    });
  }

  return where;
};