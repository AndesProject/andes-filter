import { EvaluateFilter } from '../evaluate-filter.interface'

export class InsensitiveModeFilter implements EvaluateFilter {
  constructor(private filters: EvaluateFilter[]) {}
  public evaluate(value: any): boolean {
    if (!this.filters || this.filters.length === 0) return true
    if (value == null) return false
    return this.filters.every((filter) => filter.evaluate(value))
  }
}
