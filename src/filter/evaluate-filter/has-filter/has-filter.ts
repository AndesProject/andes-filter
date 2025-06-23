import { isNonEmptyArray } from '../../utils/filter.helpers'
import { EvaluateFilter } from '../evaluate-filter.interface'

export class HasFilter<T> implements EvaluateFilter {
  constructor(private requiredValue: T) {}

  evaluate(arrayValue: any): boolean {
    if (!isNonEmptyArray(arrayValue)) return false
    return arrayValue.includes(this.requiredValue)
  }
}
