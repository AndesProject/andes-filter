import { EvaluateFilter } from '../evaluate-filter.interface'

export class DateBeforeFilter implements EvaluateFilter {
  constructor(private referenceDate: Date) {}

  evaluate(value: any): boolean {
    return value instanceof Date && value < this.referenceDate
  }
}
