import { FilterOptions } from '../../filter.interface'
import { EvaluateFilter } from '../evaluate-filter.interface'
import { matchesFilter } from '../matches-filter'

export class SomeFilter<T> implements EvaluateFilter {
  constructor(private filterKeys: FilterOptions<T>) {}

  evaluate(value: any): boolean {
    const isValid: boolean = matchesFilter<T>(this.filterKeys, value)
    return isValid
  }
}
