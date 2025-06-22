import { EvaluateFilter } from '../evaluate-filter.interface'

export class HasFilter<T> implements EvaluateFilter {
  constructor(private targetValue: T) {}

  evaluate(value: any): boolean {
    if (value === null || value === undefined) return false
    if (!Array.isArray(value)) return false
    if (value.length === 0) return false

    return value.includes(this.targetValue)
  }
}
