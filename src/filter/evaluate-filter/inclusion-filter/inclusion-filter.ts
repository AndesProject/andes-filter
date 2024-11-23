import { EvaluateFilter } from '../evaluate-filter.interface'

export class InclusionFilter<T> implements EvaluateFilter {
  constructor(private targetValues: T[]) {}

  evaluate(value: T): boolean {
    return this.targetValues.includes(value)
  }
}
