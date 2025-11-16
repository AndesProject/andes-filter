import { performStringOperation } from '../../utils/filter.helpers'
import { EvaluateFilter } from '../evaluate-filter.interface'

export class NotEndsWithFilter implements EvaluateFilter {
  constructor(
    private excludedSuffix: string,
    private isCaseInsensitive: boolean = false,
  ) {}
  public evaluate(targetString: any): boolean {
    return performStringOperation(
      'endsWith',
      targetString,
      this.excludedSuffix,
      this.isCaseInsensitive,
      true,
    )
  }
}
