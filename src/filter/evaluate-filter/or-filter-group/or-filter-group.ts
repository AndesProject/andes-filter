import { QueryOption } from '../../filter.interface'
import { FilterEvaluator } from '../evaluate-filter'
import { EvaluateFilter } from '../evaluate-filter.interface'

export class OrFilterGroup<T> implements EvaluateFilter {
  constructor(private filterKeys: QueryOption<T, keyof T>[]) {}

  evaluate(value: any): boolean {
    return this.filterKeys.some(f => new FilterEvaluator(f).evaluate(value))
  }
}
