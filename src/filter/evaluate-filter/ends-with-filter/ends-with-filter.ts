import { performStringOperation } from '../../utils/filter.helpers'
import { EvaluateFilter } from '../evaluate-filter.interface'

export class EndsWithFilter implements EvaluateFilter {
  constructor(
    private suffixValue: string,
    private isCaseInsensitive: boolean = false
  ) {}
  public evaluate(targetString: any): boolean {
    return performStringOperation(
      'endsWith',
      targetString,
      this.suffixValue,
      this.isCaseInsensitive,
      false
    )
  }
}
