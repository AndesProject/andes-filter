import { FilterKeys } from '../filter.interface'
import { AndFilterGroup } from './and-filter-group'
import { ArrayEveryFilter } from './array-every-filter'
import { ArrayNoneFilter } from './array-none-filter'
import { ArraySomeFilter } from './array-some-filter'
import { DateAfterFilter } from './date-after-filter'
import { DateBeforeFilter } from './date-before-filter'
import { DateBetweenFilter } from './date-between-filter'
import { EqualityFilter } from './equality-filter'
import { ExclusionFilter } from './exclusion-filter'
import { GreaterThanFilter } from './greater-than-filter'
import { GreaterThanOrEqualFilter } from './greater-than-or-equal-filter'
import { InclusionFilter } from './inclusion-filter'
import { InequalityFilter } from './inequality-filter'
import { LessThanFilter } from './less-than-filter'
import { LessThanOrEqualFilter } from './less-than-or-equal-filter'
import { NotFilterGroup } from './not-filter-group'
import { OrFilterGroup } from './or-filter-group'
import { StringContainsFilter } from './string-contains-filter'
import { StringEndsWithFilter } from './string-ends-with-filter'
import { StringInsensitiveModeFilter } from './string-insensitive-mode-filter'
import { StringNotContainsFilter } from './string-not-contains-filter'
import { StringNotEndsWithFilter } from './string-not-ends-with-filter'
import { StringNotStartsWithFilter } from './string-not-starts-with-filter'
import { StringRegexFilter } from './string-regex-filter'
import { StringStartsWithFilter } from './string-starts-with-filter'

export function createFilterClassMap<T>() {
  return {
    equals: EqualityFilter,
    not: InequalityFilter,
    in: InclusionFilter,
    notIn: ExclusionFilter,
    lt: LessThanFilter,
    lte: LessThanOrEqualFilter,
    gt: GreaterThanFilter,
    gte: GreaterThanOrEqualFilter,
    contains: StringContainsFilter,
    notContains: StringNotContainsFilter,
    startsWith: StringStartsWithFilter,
    notStartsWith: StringNotStartsWithFilter,
    endsWith: StringEndsWithFilter,
    notEndsWith: StringNotEndsWithFilter,
    mode: StringInsensitiveModeFilter,
    regex: StringRegexFilter,
    // isEmpty
    // notEmpty
    // search
    before: DateBeforeFilter,
    after: DateAfterFilter,
    between: DateBetweenFilter,
    some: ArraySomeFilter,
    none: ArrayNoneFilter,
    every: ArrayEveryFilter,
    // isSet
    // has
    // hasEvery
    // hasSome
    // length
    AND: AndFilterGroup,
    OR: OrFilterGroup,
    NOT: NotFilterGroup,
    // isNull
    // distinct
  } as { [key in keyof FilterKeys<T, keyof T>]: any }
}
