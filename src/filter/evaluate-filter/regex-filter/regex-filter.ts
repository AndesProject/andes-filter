import { SafeEvaluator } from '../../utils/error-handling'
import { ValidationUtils } from '../../utils/validators'
import { EvaluateFilter } from '../evaluate-filter.interface'

export class RegexFilter implements EvaluateFilter {
  private pattern: string
  private flags: string | undefined

  constructor(pattern: string | { pattern: string; flags?: string }) {
    if (ValidationUtils.validateString(pattern)) {
      this.pattern = pattern
      this.flags = undefined
    } else {
      this.pattern = pattern.pattern
      this.flags = pattern.flags
    }
  }

  public evaluate(input: any): boolean {
    if (!ValidationUtils.validateString(input)) return false
    return SafeEvaluator.testRegex(this.pattern, this.flags, input)
  }
}
