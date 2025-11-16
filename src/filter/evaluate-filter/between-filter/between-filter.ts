import { SafeEvaluator } from '../../utils/error-handling'
import {
  isNil,
  isNumber,
  isString,
  isValidDate,
} from '../../utils/filter.helpers'
import { EvaluateFilter } from '../evaluate-filter.interface'

export class BetweenFilter implements EvaluateFilter {
  private range: [any, any]
  constructor(range: [any, any]) {
    this.range = range
  }
  public evaluate(actualValue: any): boolean {
    if (isNil(actualValue) || isNil(this.range[0]) || isNil(this.range[1]))
      return false
    // Check for mixed types (string vs number) - return false
    if (
      (isString(actualValue) &&
        (isNumber(this.range[0]) || isNumber(this.range[1]))) ||
      (isNumber(actualValue) &&
        (isString(this.range[0]) || isString(this.range[1])))
    ) {
      return false
    }

    if (
      isNumber(actualValue) &&
      isNumber(this.range[0]) &&
      isNumber(this.range[1])
    ) {
      if (
        Number.isNaN(actualValue) ||
        Number.isNaN(this.range[0]) ||
        Number.isNaN(this.range[1])
      )
        return false

      return actualValue >= this.range[0] && actualValue <= this.range[1]
    }

    if (
      isValidDate(actualValue) &&
      isValidDate(this.range[0]) &&
      isValidDate(this.range[1])
    ) {
      const actualTime = new Date(actualValue).getTime()

      const minTime = new Date(this.range[0]).getTime()

      const maxTime = new Date(this.range[1]).getTime()

      return actualTime >= minTime && actualTime <= maxTime
    }

    // Si el valor es fecha pero los extremos no son fechas válidas, retorna false
    if (
      isValidDate(actualValue) &&
      (!isValidDate(this.range[0]) || !isValidDate(this.range[1]))
    ) {
      return false
    }

    // Si los extremos son strings que no son fechas válidas, retorna false
    if (
      isString(this.range[0]) &&
      isString(this.range[1]) &&
      !isValidDate(this.range[0]) &&
      !isValidDate(this.range[1])
    ) {
      return false
    }

    if (
      isString(actualValue) &&
      isString(this.range[0]) &&
      isString(this.range[1])
    ) {
      // Solo hacer comparación de strings si ambos extremos son fechas válidas
      if (isValidDate(this.range[0]) && isValidDate(this.range[1])) {
        return actualValue >= this.range[0] && actualValue <= this.range[1]
      }

      return false
    }

    return SafeEvaluator.evaluate(() => {
      return actualValue >= this.range[0] && actualValue <= this.range[1]
    }, false)
  }
}
