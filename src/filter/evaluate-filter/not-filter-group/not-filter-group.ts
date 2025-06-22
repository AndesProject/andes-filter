import { QueryOption } from '../../filter.interface'
import { EvaluateFilter } from '../evaluate-filter.interface'
import { matchesFilter } from '../matches-filter'

export class NotFilterGroup<T> implements EvaluateFilter {
  private filters: QueryOption<T, keyof T>[]

  constructor(filters: QueryOption<T, keyof T>[]) {
    this.filters = filters
  }

  evaluate(data: any): boolean {
    if (!this.filters || this.filters.length === 0) return true

    // NOT group: negate the disjunction of all subfilters
    return !this.filters.some((filter) => matchesFilter(filter, data))
  }
}
