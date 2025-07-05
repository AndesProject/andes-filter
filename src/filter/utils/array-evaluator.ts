import { FilterEvaluator } from '../evaluate-filter/evaluate-filter'
import { EvaluateFilter } from '../evaluate-filter/evaluate-filter.interface'
import { ValidationUtils } from './validators'

// Utilidades de evaluación de arrays centralizadas
export class ArrayEvaluator {
  /** Evalúa un array con una operación específica */
  static evaluateArray(
    data: any,
    evaluator: (item: any) => boolean,
    operation: 'some' | 'every' | 'none'
  ): boolean {
    if (!ValidationUtils.validateArray(data)) return false

    switch (operation) {
      case 'some':
        return data.some(
          (item: any) =>
            ValidationUtils.validateNotNull(item) && evaluator(item)
        )
      case 'every':
        return data.every(
          (item: any) =>
            ValidationUtils.validateNotNull(item) && evaluator(item)
        )
      case 'none':
        return data.every(
          (item: any) =>
            !ValidationUtils.validateNotNull(item) || !evaluator(item)
        )
      default:
        return false
    }
  }

  /** Evalúa un array con un filtro vacío */
  static evaluateEmptyFilter(
    data: any,
    operation: 'some' | 'every' | 'none'
  ): boolean {
    if (!ValidationUtils.validateArray(data)) return false

    switch (operation) {
      case 'some':
        return data.some(
          (item: any) =>
            ValidationUtils.validateNotNull(item) &&
            ValidationUtils.validateObject(item)
        )
      case 'every':
        return true // Un filtro vacío siempre es verdadero para 'every'
      case 'none':
        return false // Un filtro vacío siempre es falso para 'none'
      default:
        return false
    }
  }

  /** Evalúa un array con un filtro primitivo */
  static evaluatePrimitiveFilter(
    data: any,
    filter: any,
    operation: 'some' | 'every' | 'none'
  ): boolean {
    if (!ValidationUtils.validateArray(data)) return false

    const evaluator = (item: any) => item === filter

    return this.evaluateArray(data, evaluator, operation)
  }

  /** Evalúa un array con un filtro de objeto simple */
  static evaluateSimpleObjectFilter(
    data: any,
    filter: any,
    operation: 'some' | 'every' | 'none'
  ): boolean {
    if (!ValidationUtils.validateArray(data)) return false

    const evaluator = (item: any) => {
      if (!ValidationUtils.validateObject(item)) return false
      return Object.keys(filter).every((key) => item[key] === filter[key])
    }

    return this.evaluateArray(data, evaluator, operation)
  }

  /** Evalúa un array con un evaluador complejo */
  static evaluateComplexFilter(
    data: any,
    evaluator: EvaluateFilter | FilterEvaluator<any>,
    operation: 'some' | 'every' | 'none'
  ): boolean {
    if (!ValidationUtils.validateArray(data)) return false

    const evaluateItem = (item: any) => {
      if (!ValidationUtils.validateNotNull(item)) return false
      return evaluator.evaluate(item)
    }

    return this.evaluateArray(data, evaluateItem, operation)
  }

  /** Verifica si un array tiene valores únicos (distinct) */
  static isDistinct(data: any): boolean {
    if (!ValidationUtils.validateArray(data)) return false
    const uniqueValues = new Set(data)
    return uniqueValues.size === data.length
  }
}
