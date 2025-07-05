import { FilterCriteria } from '../filter.interface'
import { Logger } from '../utils/logger'
import { AfterFilter } from './after-filter'
import { AndFilterGroup } from './and-filter-group'
import { BeforeFilter } from './before-filter'
import { BetweenFilter } from './between-filter'
import { ContainsFilter } from './contains-filter'
import { EndsWithFilter } from './ends-with-filter'
import { EqualityFilter } from './equality-filter'
import { EvaluateFilter } from './evaluate-filter.interface'
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

// Registro dinámico de filtros y operadores
class FilterRegistry {
  private static filterMap: Record<
    string,
    (value: any, isCaseInsensitive?: boolean) => EvaluateFilter
  > = {}
  private static operatorSet: Set<string> = new Set()

  public static registerFilter(
    type: string,
    factory: (value: any, isCaseInsensitive?: boolean) => EvaluateFilter
  ) {
    this.filterMap[type] = factory
    this.operatorSet.add(type)
  }

  public static getFilter(
    type: string
  ): ((value: any, isCaseInsensitive?: boolean) => EvaluateFilter) | undefined {
    return this.filterMap[type]
  }

  public static isOperator(type: string): boolean {
    return this.operatorSet.has(type)
  }

  public static getOperators(): string[] {
    return Array.from(this.operatorSet)
  }
}

// Registro inicial de filtros (core)
function registerCoreFilters() {
  FilterRegistry.registerFilter('equals', (v, i) => new EqualityFilter(v, i))
  FilterRegistry.registerFilter('not', (v, i) => new InequalityFilter(v, i))
  FilterRegistry.registerFilter('in', (v, i) => new InclusionFilter(v, i))
  FilterRegistry.registerFilter('notIn', (v, i) => new ExclusionFilter(v, i))
  FilterRegistry.registerFilter('lt', (v) => new LessThanFilter(v))
  FilterRegistry.registerFilter('lte', (v) => new LessThanOrEqualFilter(v))
  FilterRegistry.registerFilter('gt', (v) => new GreaterThanFilter(v))
  FilterRegistry.registerFilter('gte', (v) => new GreaterThanOrEqualFilter(v))
  FilterRegistry.registerFilter('contains', (v, i) => new ContainsFilter(v, i))
  FilterRegistry.registerFilter(
    'notContains',
    (v, i) => new NotContainsFilter(v, i)
  )
  FilterRegistry.registerFilter(
    'startsWith',
    (v, i) => new StartsWithFilter(v, i)
  )
  FilterRegistry.registerFilter(
    'notStartsWith',
    (v, i) => new NotStartsWithFilter(v, i)
  )
  FilterRegistry.registerFilter('endsWith', (v, i) => new EndsWithFilter(v, i))
  FilterRegistry.registerFilter(
    'notEndsWith',
    (v, i) => new NotEndsWithFilter(v, i)
  )
  FilterRegistry.registerFilter('regex', (v) => new RegexFilter(v))
  FilterRegistry.registerFilter('before', (v) => new BeforeFilter(v))
  FilterRegistry.registerFilter('after', (v) => new AfterFilter(v))
  FilterRegistry.registerFilter('between', (v) => new BetweenFilter(v))
  FilterRegistry.registerFilter('some', (v) => new SomeFilter(v))
  FilterRegistry.registerFilter('none', (v) => new NoneFilter(v))
  FilterRegistry.registerFilter('every', (v) => new EveryFilter(v))
  FilterRegistry.registerFilter('has', (v) => new HasFilter(v))
  FilterRegistry.registerFilter('hasEvery', (v) => new HasEveryFilter(v))
  FilterRegistry.registerFilter('hasSome', (v) => new HasSomeFilter(v))
  FilterRegistry.registerFilter('length', (v) => new LengthFilter(v))
  FilterRegistry.registerFilter('AND', (v) => new AndFilterGroup(v))
  FilterRegistry.registerFilter('OR', (v) => new OrFilterGroup(v))
  FilterRegistry.registerFilter('NOT', (v) => new NotFilterGroup(v))
  FilterRegistry.registerFilter('isNull', (v) => new IsNullFilter(v))
  FilterRegistry.registerFilter('distinct', () => ({
    evaluate: (arrayData: any) => {
      if (!Array.isArray(arrayData)) return false
      const uniqueValues = new Set(arrayData)
      return uniqueValues.size === arrayData.length
    },
  }))
}
registerCoreFilters()

// Clase principal responsable de coordinar la creación de filtros
class FilterFactory {
  public static createFilter<T>(
    filterType: keyof FilterCriteria<T>,
    filterValue: any,
    isCaseInsensitive?: boolean
  ): EvaluateFilter | null {
    if (filterType === 'mode') return null
    const factory = FilterRegistry.getFilter(filterType as string)
    if (factory) {
      return factory(filterValue, isCaseInsensitive)
    }
    Logger.unknownFilter(filterType)
    return null
  }
}

export function createFilterClassMap<T>(
  filterType: keyof FilterCriteria<T>,
  filterValue: any,
  isCaseInsensitive?: boolean
): any {
  return FilterFactory.createFilter(filterType, filterValue, isCaseInsensitive)
}

// API para registrar nuevos filtros y operadores desde fuera del core
export function registerCustomFilter(
  type: string,
  factory: (value: any, isCaseInsensitive?: boolean) => EvaluateFilter
) {
  FilterRegistry.registerFilter(type, factory)
}

export function isKnownOperator(type: string): boolean {
  return FilterRegistry.isOperator(type)
}

export function getKnownOperators(): string[] {
  return FilterRegistry.getOperators()
}
