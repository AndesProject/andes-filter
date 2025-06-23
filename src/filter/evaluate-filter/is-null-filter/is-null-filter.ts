import { EvaluateFilter } from '../evaluate-filter.interface'

export class IsNullFilter implements EvaluateFilter {
  constructor(private isNull: boolean) {}
  public evaluate(value: any): boolean {
    if (this.isNull) {
      return value === null || value === undefined
    } else {
      return value !== null && value !== undefined
    }
  }
}
