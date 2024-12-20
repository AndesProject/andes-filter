import { EvaluateFilter } from '../evaluate-filter.interface'

export class RegexFilter implements EvaluateFilter {
  constructor(private pattern: string) {}

  evaluate(input: string): boolean {
    const regex = new RegExp(this.pattern)
    return regex.test(input)
  }
}
