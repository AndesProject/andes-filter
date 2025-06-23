import { isString } from '../../utils/filter.helpers'
import { EvaluateFilter } from '../evaluate-filter.interface'

export class RegexFilter implements EvaluateFilter {
  private pattern: string
  private flags: string | undefined
  constructor(pattern: string | { pattern: string; flags?: string }) {
    if (isString(pattern)) {
      this.pattern = pattern
      this.flags = undefined
    } else {
      this.pattern = pattern.pattern
      this.flags = pattern.flags
    }
  }
  public evaluate(input: any): boolean {
    if (input === null || input === undefined) return false
    if (!isString(input)) return false
    try {
      const regex = new RegExp(this.pattern, this.flags)
      return regex.test(input)
    } catch (error) {
      return false
    }
  }
}
