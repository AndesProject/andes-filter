import { isObject } from '../../utils/filter.helpers'
import { EvaluateFilter } from '../evaluate-filter.interface'
import { isKnownOperator } from '../evaluate-filter.map'
import { matchesFilter } from '../matches-filter'

export class HasSomeFilter<T> implements EvaluateFilter {
  private requiredElements: T[]
  constructor(requiredElements: T[]) {
    this.requiredElements = requiredElements
  }

  private hasNestedFilters(obj: any): boolean {
    if (!isObject(obj) || obj === null) return false

    return Object.values(obj).some((value) => {
      if (value === null) return false
      if (!isObject(value)) return this.hasNestedFilters(value)
      const hasKnown = Object.keys(value).some((filterKey) =>
        isKnownOperator(filterKey),
      )

      return hasKnown || this.hasNestedFilters(value)
    })
  }

  public evaluate(data: any): boolean {
    if (!Array.isArray(data)) return false

    // If no required elements, any array should match (including empty arrays)
    if (this.requiredElements.length === 0) return true

    // Check if any of the required elements is found in the data array
    return this.requiredElements.some((required) => {
      // If required is a simple value, use direct comparison
      if (!isObject(required) || required === null) {
        return data.includes(required)
      }

      // If required is an object with nested filters, use matchesFilter
      if (this.hasNestedFilters(required)) {
        return data.some((item) => matchesFilter(required, item))
      }

      // For simple objects, use direct comparison
      return data.some((item) => {
        if (isObject(item) && item !== null) {
          return JSON.stringify(item) === JSON.stringify(required)
        }

        return item === required
      })
    })
  }
}
