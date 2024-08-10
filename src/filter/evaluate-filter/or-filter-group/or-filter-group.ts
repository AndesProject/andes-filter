import { FilterEvaluator } from '../../evaluate-filter'
import { FilterKeys } from '../../filter.interface'
import { EvaluateFilter } from '../evaluate-filter.interface'

export class OrFilterGroup<T> implements EvaluateFilter {
  constructor(private filterKeys: FilterKeys<T>[]) {}

  evaluate(value: any): boolean {
    return this.filterKeys.some(f => new FilterEvaluator(f).evaluate(value))
  }
}
