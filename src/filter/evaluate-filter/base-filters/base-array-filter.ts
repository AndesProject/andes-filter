import { isKnownOperator } from '../../utils/constants'
import { ValidationUtils } from '../../utils/validators'
import { EvaluateFilter } from '../evaluate-filter.interface'

export abstract class BaseArrayFilter implements EvaluateFilter {
  public constructor(protected filterCriteria: any) {}

  public abstract evaluate(data: any): boolean

  protected validateArrayInput(data: any): boolean {
    return ValidationUtils.validateArray(data)
  }

  protected isArrayEmpty(data: any[]): boolean {
    return data.length === 0
  }

  protected hasNestedFilters(obj: any): boolean {
    if (!ValidationUtils.validateObject(obj)) return false

    for (const key in obj) {
      const value = (obj as any)[key]
      if (ValidationUtils.validateObject(value)) {
        // Verificar si el valor es un objeto con filtros
        if (
          Object.keys(value).some((filterKey) => isKnownOperator(filterKey))
        ) {
          return true
        }
        // Verificar recursivamente si hay filtros anidados
        if (this.hasNestedFilters(value)) {
          return true
        }
      }
    }
    return false
  }

  protected isObject(value: any): boolean {
    return ValidationUtils.validateObject(value)
  }

  protected isKnownOperator(key: string): boolean {
    return isKnownOperator(key)
  }
}
