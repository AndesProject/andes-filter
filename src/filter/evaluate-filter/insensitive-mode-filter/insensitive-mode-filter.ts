import { EvaluateFilter } from '../evaluate-filter.interface'

export class InsensitiveModeFilter implements EvaluateFilter {
  constructor(private filters: EvaluateFilter[]) {}

  evaluate(value: string): boolean {
    return this.filters.every(filter => filter.evaluate(value))
  }
}
