import { QueryOption } from '../../filter.interface'
import { FilterEvaluator } from '../evaluate-filter'
import { EvaluateFilter } from '../evaluate-filter.interface'
import { matchesFilter } from '../matches-filter'

export class NoneFilter implements EvaluateFilter {
  constructor(private filter: any) {}

  evaluate(data: any): boolean {
    if (!Array.isArray(data)) return false
    if (data.length === 0) return true // Empty array returns true for none
    if (
      typeof this.filter === 'object' &&
      Object.keys(this.filter).length === 0
    )
      return false
    return data.every(item => {
      if (item == null) return true
      if (typeof this.filter === 'object') {
        return !matchesFilter(this.filter, item)
      }
      return item !== this.filter
    })
  }
}
