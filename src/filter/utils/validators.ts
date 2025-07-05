import { isObject, isString, isValidDate } from './filter.helpers'

// Utilidades de validación centralizadas
export class ValidationUtils {
  /** Valida si el valor es un array válido */
  static validateArray(data: any): boolean {
    return Array.isArray(data)
  }

  /** Valida si el valor es un array no vacío */
  static validateNonEmptyArray(data: any): boolean {
    return Array.isArray(data) && data.length > 0
  }

  /** Valida si el valor es un string válido */
  static validateString(input: any): boolean {
    return isString(input) && input !== null && input !== undefined
  }

  /** Valida si el valor es una fecha válida */
  static validateDate(value: any): boolean {
    return isValidDate(value)
  }

  /** Valida si el valor es un objeto válido (no null, no array) */
  static validateObject(value: any): boolean {
    return isObject(value) && value !== null && !Array.isArray(value)
  }

  /** Valida si el valor es un número válido (no NaN) */
  static validateNumber(value: any): boolean {
    return typeof value === 'number' && !Number.isNaN(value)
  }

  /** Valida si el valor no es null ni undefined */
  static validateNotNull(value: any): boolean {
    return value !== null && value !== undefined
  }

  /** Valida si el objeto es un filtro vacío */
  static isEmptyFilter(filter: any): boolean {
    return (
      isObject(filter) &&
      !Array.isArray(filter) &&
      filter !== null &&
      Object.keys(filter).length === 0
    )
  }

  /** Valida si el objeto tiene solo valores primitivos */
  static hasOnlyPrimitiveValues(obj: any): boolean {
    if (!isObject(obj) || obj === null) return false

    return Object.keys(obj).every(
      (key) =>
        typeof (obj as Record<string, any>)[key] !== 'object' ||
        (obj as Record<string, any>)[key] === null
    )
  }
}
