import { FilterKeys } from '../../filter.interface'
import { FilterEvaluator } from '../evaluate-filter'
import { EvaluateFilter } from '../evaluate-filter.interface'

/**
 * The ArrayEveryFilter class evaluates whether all elements of an array meet a specific filter
 * condition using the FilterEvaluator class.
 */

export class ArrayEveryFilter<T> implements EvaluateFilter {
  constructor(private filterKey: FilterKeys<T>) {}

  evaluate(value: any): boolean {
    if (!Array.isArray(value)) return false
    const evaluator = new FilterEvaluator(this.filterKey)
    return value.every(item => evaluator.evaluate(item))
  }
}
