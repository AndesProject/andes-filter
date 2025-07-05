import { isString } from '../../utils/filter.helpers'
import { BaseComparisonFilter } from '../base-filters'
import { ComparisonFilter } from '../evaluate-filter.interface'

export class EqualityFilter
  extends BaseComparisonFilter
  implements ComparisonFilter
{
  public evaluate(actualValue: any): boolean {
    // Validación inicial usando la clase base
    if (!this.validateInputs(actualValue)) {
      return false
    }

    // Manejo de NaN usando la clase base
    if (Number.isNaN(this.expectedValue) && Number.isNaN(actualValue)) {
      return false
    }
    if (Number.isNaN(this.expectedValue) || Number.isNaN(actualValue)) {
      return false
    }

    // Comparación de strings usando la clase base
    if (isString(this.expectedValue) && isString(actualValue)) {
      return this.compareStrings(this.expectedValue, actualValue)
    }

    // Comparación de fechas usando la clase base
    const dateResult = this.handleDateComparison(actualValue)
    if (dateResult !== null) {
      return dateResult
    }

    // Comparación de objetos usando la clase base
    if (this.compareObjects(this.expectedValue, actualValue)) {
      return true
    }

    // Comparación directa
    return actualValue === this.expectedValue
  }
}
