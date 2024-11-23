import { EvaluateFilter } from '../evaluate-filter.interface'

export class ExclusionFilter<T> implements EvaluateFilter {
  constructor(private targetValues: T[]) {}

  evaluate(value: any): boolean {
    return !this.targetValues.includes(value)
  }
}
