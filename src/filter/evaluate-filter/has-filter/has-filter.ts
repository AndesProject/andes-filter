import { isNumber, isObject, isString } from '../../utils/filter.helpers'
import { EvaluateFilter } from '../evaluate-filter.interface'

export class HasFilter<T> implements EvaluateFilter {
  private requiredElement: T
  constructor(requiredElement: T) {
    this.requiredElement = requiredElement
  }
  public evaluate(actualArray: T[]): boolean {
    if (!Array.isArray(actualArray)) return false
    for (const item of actualArray) {
      // Evitar comparaciones mixtas string/number
      if (
        (isString(item) && isNumber(this.requiredElement)) ||
        (isNumber(item) && isString(this.requiredElement))
      ) {
        continue
      }

      // Comparación especial para NaN
      if (
        isNumber(item) &&
        isNumber(this.requiredElement) &&
        Number.isNaN(item) &&
        Number.isNaN(this.requiredElement)
      ) {
        return true
      }

      if (isObject(item) && isObject(this.requiredElement)) {
        if (item === this.requiredElement) {
          return true
        }
      } else if (item === this.requiredElement) {
        return true
      }
    }

    return false
  }
}
