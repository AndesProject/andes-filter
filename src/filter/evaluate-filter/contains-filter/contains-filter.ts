import { performStringOperation } from '../../utils/filter.helpers'
import { EvaluateFilter } from '../evaluate-filter.interface'

export class ContainsFilter implements EvaluateFilter {
  constructor(
    private searchValue: string,
    private isCaseInsensitive: boolean = false
  ) {}

  evaluate(targetString: any): boolean {
    return performStringOperation(
      'includes',
      targetString,
      this.searchValue,
      this.isCaseInsensitive,
      false
    )
  }
}
