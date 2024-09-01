import { FilterKeys } from '../filter.interface'
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
import { InclusionFilter } from './inclusion-filter'
import { InequalityFilter } from './inequality-filter'
import { InsensitiveModeFilter } from './insensitive-mode-filter'
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
    contains: ContainsFilter,
    notContains: NotContainsFilter,
    startsWith: StartsWithFilter,
    notStartsWith: NotStartsWithFilter,
    endsWith: EndsWithFilter,
    notEndsWith: NotEndsWithFilter,
    mode: InsensitiveModeFilter,
    regex: RegexFilter,
    before: BeforeFilter,
    after: AfterFilter,
    between: BetweenFilter,
    some: SomeFilter,
    none: NoneFilter,
    every: EveryFilter,
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
