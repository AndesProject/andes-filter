import { isNil } from '../../utils/filter.helpers'
import { EvaluateFilter } from '../evaluate-filter.interface'

export class GreaterThanOrEqualFilter implements EvaluateFilter {
  constructor(private value: any) {}
  public evaluate(data: any): boolean {
    if (isNil(this.value) || isNil(data)) return false

    return data >= this.value
  }
}
