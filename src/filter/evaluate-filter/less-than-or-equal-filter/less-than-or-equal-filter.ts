import { EvaluateFilter } from '../evaluate-filter.interface'

export class LessThanOrEqualFilter implements EvaluateFilter {
  constructor(private value: any) {}

  evaluate(data: any): boolean {
    if (this.value === undefined || this.value === null) return false
    if (data === undefined || data === null) return false
    return data <= this.value
  }
}
