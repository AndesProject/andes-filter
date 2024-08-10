import { EvaluateFilter } from '../evaluate-filter.interface'

export class EqualityFilter<T> implements EvaluateFilter {
  constructor(private targetValue: T | null) {}

  evaluate(value: any): boolean {
    return value === this.targetValue
  }
}
