import { QueryOption } from '../../filter.interface'
import { EvaluateFilter } from '../evaluate-filter.interface'
import { matchesFilter } from '../matches-filter'

export class AndFilterGroup<T> implements EvaluateFilter {
  private filters: QueryOption<T, keyof T>[]

  constructor(filters: QueryOption<T, keyof T>[]) {
    this.filters = filters
  }

  evaluate(data: any): boolean {
    if (!this.filters || this.filters.length === 0) return true

    return this.filters.every((filter) => matchesFilter(filter, data))
  }
}
