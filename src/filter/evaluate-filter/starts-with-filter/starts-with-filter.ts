import { EvaluateFilter } from '../evaluate-filter.interface'

export class StartsWithFilter implements EvaluateFilter {
  constructor(
    private value: string,
    private insensitive: boolean = false
  ) {}

  evaluate(input: string): boolean {
    const compareInput = this.insensitive ? input.toLowerCase() : input
    const compareValue = this.insensitive
      ? this.value.toLowerCase()
      : this.value
    return compareInput.startsWith(compareValue)
  }
}
