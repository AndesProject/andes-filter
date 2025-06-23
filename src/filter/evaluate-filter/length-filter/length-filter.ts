import { isNumber, isObject } from '../../utils/filter.helpers'
import { EvaluateFilter } from '../evaluate-filter.interface'

export class LengthFilter implements EvaluateFilter {
  private targetLength: number | undefined
  private ops: any = {}
  constructor(
    target:
      | number
      | {
          gte?: number
          lte?: number
          gt?: number
          lt?: number
          equals?: number
        }
  ) {
    if (isNumber(target)) {
      this.targetLength = target
      this.ops.equals = target
    } else if (isObject(target)) {
      this.ops = target
      if ('equals' in target) this.targetLength = target.equals
    }
  }
  public evaluate(value: any): boolean {
    if (value === null || value === undefined) return false
    if (!Array.isArray(value) && typeof value !== 'string') return false
    const len = value.length
    if ('equals' in this.ops) {
      if (len !== this.ops.equals) return false
    }
    if ('gte' in this.ops) {
      if (len < this.ops.gte) return false
    }
    if ('lte' in this.ops) {
      if (len > this.ops.lte) return false
    }
    if ('gt' in this.ops) {
      if (len <= this.ops.gt) return false
    }
    if ('lt' in this.ops) {
      if (len >= this.ops.lt) return false
    }
    return true
  }
}
