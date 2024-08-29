import { EvaluateFilter } from '../evaluate-filter.interface'

export class GreaterThanFilter implements EvaluateFilter {
  constructor(private thresholdValue: number) {}

  evaluate(value: number): boolean {
    return value > this.thresholdValue
  }
}
