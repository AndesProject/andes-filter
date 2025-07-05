import { DateOrNumber } from '../../filter.interface'
import { BaseDateFilter } from '../base-filters'

export class AfterFilter extends BaseDateFilter {
  public evaluate(actualValue: DateOrNumber): boolean {
    if (!this.validateDateInput(actualValue)) {
      return false
    }

    const parsedDate = this.getParsedDate(actualValue)
    return this.isDateAfter(parsedDate, this.thresholdDate)
  }
}
