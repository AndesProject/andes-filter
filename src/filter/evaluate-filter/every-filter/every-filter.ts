import { ArrayEvaluator } from '../../utils/array-evaluator'
import { isKnownOperator } from '../../utils/constants'
import { ValidationUtils } from '../../utils/validators'
import { FilterEvaluator } from '../evaluate-filter'
import { EvaluateFilter } from '../evaluate-filter.interface'

export class EveryFilter implements EvaluateFilter {
  private evaluator: EvaluateFilter | FilterEvaluator<any> | null = null
  private isPrimitive: boolean = false
  private isSimpleObject: boolean = false
  private isEmptyFilter: boolean = false

  constructor(private filter: any) {
    if (ValidationUtils.isEmptyFilter(this.filter)) {
      this.isEmptyFilter = true

      return
    }

    if (
      ValidationUtils.validateObject(this.filter) &&
      Object.keys(this.filter).length > 0
    ) {
      const keys = Object.keys(this.filter)

      if (keys.length === 1 && isKnownOperator(keys[0])) {
        this.evaluator = new FilterEvaluator(this.filter)
      } else {
        const allKeysAreOperators = keys.every((key) => isKnownOperator(key))

        if (allKeysAreOperators) {
          this.evaluator = new FilterEvaluator(this.filter)
        } else {
          if (ValidationUtils.hasOnlyPrimitiveValues(this.filter)) {
            this.isSimpleObject = true
          } else {
            this.evaluator = new FilterEvaluator(this.filter)
          }
        }
      }
    } else if (typeof this.filter !== 'object' || this.filter === null) {
      this.isPrimitive = true
    }
  }

  public evaluate(data: any): boolean {
    if (!ValidationUtils.validateArray(data)) return false
    if (data.length === 0) return true
    if (this.isEmptyFilter) return true

    if (this.isPrimitive) {
      return ArrayEvaluator.evaluatePrimitiveFilter(data, this.filter, 'every')
    }

    if (this.isSimpleObject) {
      return ArrayEvaluator.evaluateSimpleObjectFilter(
        data,
        this.filter,
        'every',
      )
    }

    if (this.evaluator) {
      return ArrayEvaluator.evaluateComplexFilter(data, this.evaluator, 'every')
    }

    return false
  }
}
