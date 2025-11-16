import { DateOrNumber } from '../../filter.interface'
import { BaseDateFilter } from '../base-filters'

export class BeforeFilter extends BaseDateFilter {
  public evaluate(actualValue: DateOrNumber): boolean {
    if (!this.validateDateInput(actualValue)) {
      return false
    }

    const parsedDate = this.getParsedDate(actualValue)

    return this.isDateBefore(parsedDate, this.thresholdDate)
  }
}
