import { EvaluateFilter } from '../evaluate-filter.interface'

export class LessThanOrEqualFilter<T> implements EvaluateFilter {
  constructor(private thresholdValue: T) {}

  evaluate(value: any): boolean {
    return value <= this.thresholdValue
  }
}
