import { EvaluateFilter } from '../evaluate-filter.interface'

export class DateBetweenFilter implements EvaluateFilter {
  constructor(private dateRange: [Date, Date]) {}

  evaluate(value: any): boolean {
    return value instanceof Date && value >= this.dateRange[0] && value <= this.dateRange[1]
  }
}
