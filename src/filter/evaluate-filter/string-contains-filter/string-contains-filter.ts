import { EvaluateFilter } from '../evaluate-filter.interface'

export class StringContainsFilter implements EvaluateFilter {
  constructor(private substring: string) {}

  evaluate(value: any): boolean {
    return typeof value === 'string' && value.includes(this.substring)
  }
}
