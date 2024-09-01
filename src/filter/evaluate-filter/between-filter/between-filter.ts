import { EvaluateFilter } from '../evaluate-filter.interface'

export class BetweenFilter implements EvaluateFilter {
  constructor(
    private startDate: Date,
    private endDate: Date
  ) {}

  evaluate(value: any): boolean {
    return value instanceof Date && value >= this.startDate && value <= this.endDate
  }
}
