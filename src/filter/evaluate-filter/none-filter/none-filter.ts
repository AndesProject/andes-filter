import { QueryOption } from '../../filter.interface'
import { FilterEvaluator } from '../evaluate-filter'
import { EvaluateFilter } from '../evaluate-filter.interface'

export class NoneFilter<T> implements EvaluateFilter {
  constructor(private filterKey: QueryOption<T, keyof T>) {}

  evaluate(value: any): boolean {
    if (!Array.isArray(value)) return false
    const evaluator = new FilterEvaluator(this.filterKey)
    return value.every(v => !evaluator.evaluate(v))
  }
}
