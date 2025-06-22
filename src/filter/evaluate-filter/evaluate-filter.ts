import { QueryOption } from '../filter.interface'
import { EvaluateFilter } from './evaluate-filter.interface'
import { createFilterClassMap } from './evaluate-filter.map'

const OPERATORS = [
  'equals',
  'not',
  'in',
  'notIn',
  'lt',
  'lte',
  'gt',
  'gte',
  'contains',
  'notContains',
  'startsWith',
  'notStartsWith',
  'endsWith',
  'notEndsWith',
  'mode',
  'regex',
  'before',
  'after',
  'between',
  'some',
  'none',
  'every',
  'has',
  'hasEvery',
  'hasSome',
  'length',
  'AND',
  'OR',
  'NOT',
  'isNull',
  'distinct',
]

export class FilterEvaluator<T> {
  private filters: {
    key: string
    filter: EvaluateFilter | FilterEvaluator<any>
  }[] = []
  private filterKeys: QueryOption<T, keyof T>

  constructor(filter: QueryOption<T, keyof T>) {
    this.filterKeys = filter
    this.initializeFilters()
  }

  private initializeFilters(): void {
    // Check if mode is present to determine if we should use insensitive mode
    const hasInsensitiveMode = this.filterKeys.mode === 'insensitive'

    Object.keys(this.filterKeys).forEach(key => {
      if (key === 'mode') return // Skip mode key itself

      const value = this.filterKeys[key as keyof QueryOption<T, keyof T>]
      if (OPERATORS.includes(key)) {
        const filter = createFilterClassMap<T>(
          key as keyof QueryOption<T, keyof T>,
          value,
          hasInsensitiveMode
        )
        if (filter) {
          this.filters.push({ key, filter })
        }
      } else {
        // Es un campo del objeto, crear un FilterEvaluator para el subfiltro
        this.filters.push({
          key,
          filter: new FilterEvaluator(value as any),
        })
      }
    })
  }

  evaluate(data: any): boolean {
    if (this.filters.length === 0) return true
    return this.filters.every(({ key, filter }) => {
      if (filter instanceof FilterEvaluator) {
        // Es un campo del objeto, aplicar el filtro al valor correspondiente
        const fieldValue =
          data && typeof data === 'object' ? data[key] : undefined
        return filter.evaluate(fieldValue)
      } else {
        // Es un filtro operador
        return filter.evaluate(data)
      }
    })
  }
}
