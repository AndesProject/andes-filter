import { EvaluateFilter } from '../evaluate-filter.interface'

export class NotContainsFilter implements EvaluateFilter {
  constructor(
    private value: string,
    private insensitive: boolean = false
  ) {}

  evaluate(data: any): boolean {
    if (typeof data !== 'string' || typeof this.value !== 'string') return true
    if (this.insensitive) {
      return !data.toLowerCase().includes(this.value.toLowerCase())
    }
    return !data.includes(this.value)
  }
}
