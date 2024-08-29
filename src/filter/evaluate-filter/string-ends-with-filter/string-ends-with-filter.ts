import { EvaluateFilter } from '../evaluate-filter.interface'

export class StringEndsWithFilter implements EvaluateFilter {
  constructor(private suffix: string) {}

  evaluate(value: string): boolean {
    return typeof value === 'string' && value.endsWith(this.suffix)
  }
}
