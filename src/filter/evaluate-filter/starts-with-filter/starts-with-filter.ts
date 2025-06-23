import { performStringOperation } from '../../utils/filter.helpers'
import { EvaluateFilter } from '../evaluate-filter.interface'

export class StartsWithFilter implements EvaluateFilter {
  constructor(
    private prefixValue: string,
    private isCaseInsensitive: boolean = false
  ) {}

  evaluate(targetString: any): boolean {
    return performStringOperation(
      'startsWith',
      targetString,
      this.prefixValue,
      this.isCaseInsensitive,
      false
    )
  }
}
