import { EvaluateFilter } from '../evaluate-filter.interface'

export class StringContainsFilter implements EvaluateFilter {
  constructor(private substring: string) {}

  evaluate(value: string): boolean {
    return typeof value === 'string' && Boolean(value.length) && value.includes(this.substring)
  }
}
