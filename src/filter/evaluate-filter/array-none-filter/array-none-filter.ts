import { FilterEvaluator } from '../../evaluate-filter'
import { FilterKeys } from '../../filter.interface'
import { EvaluateFilter } from '../evaluate-filter.interface'

export class ArrayNoneFilter<T> implements EvaluateFilter {
  constructor(private filterKey: FilterKeys<T>) {}

  evaluate(value: any): boolean {
    if (!Array.isArray(value)) return false
    const evaluator = new FilterEvaluator(this.filterKey)
    return value.every(v => !evaluator.evaluate(v))
  }
}
