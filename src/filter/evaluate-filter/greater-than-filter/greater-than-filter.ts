import { EvaluateFilter } from '../evaluate-filter.interface'

export class GreaterThanFilter<T> implements EvaluateFilter {
  constructor(private thresholdValue: T) {}

  evaluate(value: any): boolean {
    return value > this.thresholdValue
  }
}
