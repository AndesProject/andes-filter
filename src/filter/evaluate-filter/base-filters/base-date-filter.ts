import { DateOrNumber } from '../../filter.interface'
import { SafeEvaluator } from '../../utils/error-handling'
import { ValidationUtils } from '../../utils/validators'
import { EvaluateFilter } from '../evaluate-filter.interface'

export abstract class BaseDateFilter implements EvaluateFilter {
  public thresholdDate: Date

  public constructor(thresholdDate: DateOrNumber) {
    this.thresholdDate = new Date(thresholdDate)
  }

  public abstract evaluate(actualValue: DateOrNumber): boolean

  protected validateDateInput(actualValue: DateOrNumber): boolean {
    if (!ValidationUtils.validateNotNull(actualValue)) return false
    if (this.thresholdDate == null || isNaN(this.thresholdDate.getTime()))
      return false
    if (!ValidationUtils.validateDate(actualValue)) return false

    const parsedDate = new Date(actualValue)

    if (isNaN(parsedDate.getTime())) return false

    return true
  }

  protected getParsedDate(actualValue: DateOrNumber): Date {
    return new Date(actualValue)
  }

  protected compareDates(date1: Date, date2: Date): number {
    return date1.getTime() - date2.getTime()
  }

  protected isDateBefore(date1: Date, date2: Date): boolean {
    return SafeEvaluator.compareDates(date1, date2, 'lt')
  }

  protected isDateAfter(date1: Date, date2: Date): boolean {
    return SafeEvaluator.compareDates(date1, date2, 'gt')
  }

  protected isDateEqual(date1: Date, date2: Date): boolean {
    return SafeEvaluator.compareDates(date1, date2, 'eq')
  }
}
