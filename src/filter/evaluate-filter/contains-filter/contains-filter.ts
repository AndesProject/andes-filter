import { BaseStringFilter } from '../base-filters'
import { StringFilter } from '../evaluate-filter.interface'

export class ContainsFilter extends BaseStringFilter implements StringFilter {
  public evaluate(targetString: any): boolean {
    if (!this.validateStringInput(targetString)) {
      return false
    }

    return this.performStringOperation(
      'includes',
      targetString,
      this.searchValue,
    )
  }
}
