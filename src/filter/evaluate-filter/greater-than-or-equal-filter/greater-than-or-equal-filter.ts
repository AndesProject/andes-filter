import { EvaluateFilter } from '../evaluate-filter.interface'

export class GreaterThanOrEqualFilter<T> implements EvaluateFilter {
  constructor(private thresholdValue: T) {}

  evaluate(value: any): boolean {
    return value >= this.thresholdValue
  }
}
