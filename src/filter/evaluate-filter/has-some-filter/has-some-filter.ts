import { anyMatch } from '../../utils/filter.helpers'
import { EvaluateFilter } from '../evaluate-filter.interface'
import { matchesFilter } from '../matches-filter'

export class HasSomeFilter<T> implements EvaluateFilter {
  constructor(private targetValues: T[]) {}

  evaluate(value: any): boolean {
    if (!Array.isArray(value)) return false
    if (value.length === 0) return this.targetValues.length === 0
    if (this.targetValues.length === 0) return true

    if (
      this.targetValues.some(
        (target) => typeof target === 'object' && target !== null
      )
    ) {
      return this.targetValues.some((targetValue) => {
        return anyMatch(value, (item) =>
          matchesFilter(targetValue as any, item)
        )
      })
    }

    return this.targetValues.some((targetValue) => value.includes(targetValue))
  }
}
