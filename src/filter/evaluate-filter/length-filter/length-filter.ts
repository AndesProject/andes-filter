import { EvaluateFilter } from '../evaluate-filter.interface'

export class LengthFilter implements EvaluateFilter {
  constructor(private targetLength: number) {}

  evaluate(value: any): boolean {
    if (value === null || value === undefined) return false
    if (!Array.isArray(value)) return false

    return value.length === this.targetLength
  }
}
