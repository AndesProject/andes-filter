import { EvaluateFilter } from '../evaluate-filter.interface'

export class StringStartsWithFilter implements EvaluateFilter {
  constructor(private prefix: string) {}

  evaluate(value: any): boolean {
    return typeof value === 'string' && value.startsWith(this.prefix)
  }
}
