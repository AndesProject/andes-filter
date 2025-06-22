import { QueryOption } from '../../filter.interface'
import { FilterEvaluator } from '../evaluate-filter'
import { EvaluateFilter } from '../evaluate-filter.interface'
import { matchesFilter } from '../matches-filter'

export class SomeFilter<T> implements EvaluateFilter {
  constructor(private filter: any) {}

  evaluate(data: any): boolean {
    if (!Array.isArray(data)) return false
    if (data.length === 0) return false // Empty array returns false for some

    return data.some(item => {
      if (item == null) return false
      if (typeof this.filter === 'object') {
        return matchesFilter(this.filter, item)
      }
      return item === this.filter
    })
  }
}
