import { QueryOption } from '../filter.interface'
import { AfterFilter } from './after-filter'
import { AndFilterGroup } from './and-filter-group'
import { BeforeFilter } from './before-filter'
import { BetweenFilter } from './between-filter'
import { ContainsFilter } from './contains-filter'
import { EndsWithFilter } from './ends-with-filter'
import { EqualityFilter } from './equality-filter'
import { EveryFilter } from './every-filter'
import { ExclusionFilter } from './exclusion-filter'
import { GreaterThanFilter } from './greater-than-filter'
import { GreaterThanOrEqualFilter } from './greater-than-or-equal-filter'
import { HasEveryFilter } from './has-every-filter'
import { HasFilter } from './has-filter'
import { HasSomeFilter } from './has-some-filter'
import { InclusionFilter } from './inclusion-filter'
import { InequalityFilter } from './inequality-filter'
import { InsensitiveModeFilter } from './insensitive-mode-filter'
import { IsNullFilter } from './is-null-filter'
import { LengthFilter } from './length-filter'
import { LessThanFilter } from './less-than-filter'
import { LessThanOrEqualFilter } from './less-than-or-equal-filter'
import { NoneFilter } from './none-filter'
import { NotContainsFilter } from './not-contains-filter'
import { NotEndsWithFilter } from './not-ends-with-filter'
import { NotFilterGroup } from './not-filter-group'
import { NotStartsWithFilter } from './not-starts-with-filter'
import { OrFilterGroup } from './or-filter-group'
import { RegexFilter } from './regex-filter'
import { SomeFilter } from './some-filter'
import { StartsWithFilter } from './starts-with-filter'

export function createFilterClassMap<T>(
  type: keyof QueryOption<T>,
  filter: any,
  insensitive?: boolean
): any {
  switch (type) {
    case 'equals':
      return new EqualityFilter(filter)
    case 'not':
      return new InequalityFilter(filter)
    case 'in':
      return new InclusionFilter(filter)
    case 'notIn':
      return new ExclusionFilter(filter)
    case 'lt':
      return new LessThanFilter(filter)
    case 'lte':
      return new LessThanOrEqualFilter(filter)
    case 'gt':
      return new GreaterThanFilter(filter)
    case 'gte':
      return new GreaterThanOrEqualFilter(filter)
    case 'contains':
      return new ContainsFilter(filter, insensitive)
    case 'notContains':
      return new NotContainsFilter(filter, insensitive)
    case 'startsWith':
      return new StartsWithFilter(filter, insensitive)
    case 'notStartsWith':
      return new NotStartsWithFilter(filter, insensitive)
    case 'endsWith':
      return new EndsWithFilter(filter, insensitive)
    case 'notEndsWith':
      return new NotEndsWithFilter(filter, insensitive)
    case 'mode':
      // Mode is handled as a configuration flag, not a separate filter
      return null
    case 'regex':
      return new RegexFilter(filter)
    case 'before':
      return new BeforeFilter(filter)
    case 'after':
      return new AfterFilter(filter)
    case 'between':
      return new BetweenFilter(filter)
    case 'some':
      return new SomeFilter(filter)
    case 'none':
      return new NoneFilter(filter)
    case 'every':
      return new EveryFilter(filter)
    case 'has':
      return new HasFilter(filter)
    case 'hasEvery':
      return new HasEveryFilter(filter)
    case 'hasSome':
      return new HasSomeFilter(filter)
    case 'length':
      return new LengthFilter(filter)
    case 'AND':
      return new AndFilterGroup(filter)
    case 'OR':
      return new OrFilterGroup(filter)
    case 'NOT':
      return new NotFilterGroup(filter)
    case 'isNull':
      return new IsNullFilter(filter)
    default:
      console.warn(`Unknown filter type: ${type}`)
      return null
  }
}
