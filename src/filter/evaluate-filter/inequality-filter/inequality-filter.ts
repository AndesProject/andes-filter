import { EvaluateFilter } from '../evaluate-filter.interface'

export class InequalityFilter<T> implements EvaluateFilter {
  constructor(private targetValue: T) {}

  evaluate(value: any): boolean {
    return value !== this.targetValue
  }
}
