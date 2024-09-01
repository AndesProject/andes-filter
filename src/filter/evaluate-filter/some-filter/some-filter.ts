import { FilterKeys } from '../../filter.interface'
import { FilterEvaluator } from '../evaluate-filter'
import { EvaluateFilter } from '../evaluate-filter.interface'

export class SomeFilter<T> implements EvaluateFilter {
  constructor(private filterKey: FilterKeys<T, keyof T>) {}

  evaluate(value: any): boolean {
    if (!Array.isArray(value)) return false
    const evaluator = new FilterEvaluator(this.filterKey)
    return value.some(v => evaluator.evaluate(v))
  }
}
