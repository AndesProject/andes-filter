import { performStringOperation } from '../../utils/filter.helpers'
import { EvaluateFilter } from '../evaluate-filter.interface'

export class NotContainsFilter implements EvaluateFilter {
  constructor(
    private excludedValue: string,
    private isCaseInsensitive: boolean = false
  ) {}
  public evaluate(targetString: any): boolean {
    return performStringOperation(
      'includes',
      targetString,
      this.excludedValue,
      this.isCaseInsensitive,
      true
    )
  }
}
