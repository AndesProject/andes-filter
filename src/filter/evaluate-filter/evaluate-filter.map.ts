import { FilterCriteria } from '../filter.interface'
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
  filterType: keyof FilterCriteria<T>,
  filterValue: any,
  isCaseInsensitive?: boolean
): any {
  switch (filterType) {
    case 'equals':
      return new EqualityFilter(filterValue, isCaseInsensitive)
    case 'not':
      return new InequalityFilter(filterValue, isCaseInsensitive)
    case 'in':
      return new InclusionFilter(filterValue, isCaseInsensitive)
    case 'notIn':
      return new ExclusionFilter(filterValue, isCaseInsensitive)
    case 'lt':
      return new LessThanFilter(filterValue)
    case 'lte':
      return new LessThanOrEqualFilter(filterValue)
    case 'gt':
      return new GreaterThanFilter(filterValue)
    case 'gte':
      return new GreaterThanOrEqualFilter(filterValue)
    case 'contains':
      return new ContainsFilter(filterValue, isCaseInsensitive)
    case 'notContains':
      return new NotContainsFilter(filterValue, isCaseInsensitive)
    case 'startsWith':
      return new StartsWithFilter(filterValue, isCaseInsensitive)
    case 'notStartsWith':
      return new NotStartsWithFilter(filterValue, isCaseInsensitive)
    case 'endsWith':
      return new EndsWithFilter(filterValue, isCaseInsensitive)
    case 'notEndsWith':
      return new NotEndsWithFilter(filterValue, isCaseInsensitive)
    case 'mode':
      return null
    case 'regex':
      return new RegexFilter(filterValue)
    case 'before':
      return new BeforeFilter(filterValue)
    case 'after':
      return new AfterFilter(filterValue)
    case 'between':
      return new BetweenFilter(filterValue)
    case 'some':
      return new SomeFilter(filterValue)
    case 'none':
      return new NoneFilter(filterValue)
    case 'every':
      return new EveryFilter(filterValue)
    case 'has':
      return new HasFilter(filterValue)
    case 'hasEvery':
      return new HasEveryFilter(filterValue)
    case 'hasSome':
      return new HasSomeFilter(filterValue)
    case 'length':
      return new LengthFilter(filterValue)
    case 'AND':
      return new AndFilterGroup(filterValue)
    case 'OR':
      return new OrFilterGroup(filterValue)
    case 'NOT':
      return new NotFilterGroup(filterValue)
    case 'isNull':
      return new IsNullFilter(filterValue)
    case 'distinct':
      return {
        evaluate: (arrayData: any) => {
          if (!Array.isArray(arrayData)) return false
          const uniqueValues = new Set(arrayData)
          return uniqueValues.size === arrayData.length
        },
      }
    default:
      console.warn(`Unknown filter type: ${filterType}`)
      return null
  }
}
