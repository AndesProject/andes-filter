import { performStringOperation } from '../../utils/filter.helpers'
import { EvaluateFilter } from '../evaluate-filter.interface'

export class NotStartsWithFilter implements EvaluateFilter {
  constructor(
    private excludedPrefix: string,
    private isCaseInsensitive: boolean = false
  ) {}
  public evaluate(targetString: any): boolean {
    return performStringOperation(
      'startsWith',
      targetString,
      this.excludedPrefix,
      this.isCaseInsensitive,
      true
    )
  }
}
