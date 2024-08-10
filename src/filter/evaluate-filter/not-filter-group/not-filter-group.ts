import { FilterKeys } from '../../filter.interface'
import { FilterEvaluator } from '../evaluate-filter'
import { EvaluateFilter } from '../evaluate-filter.interface'

export class NotFilterGroup<T> implements EvaluateFilter {
  constructor(private filterKeys: FilterKeys<T>[]) {}

  evaluate(value: any): boolean {
    return this.filterKeys.every(f => !new FilterEvaluator(f).evaluate(value))
  }
}
