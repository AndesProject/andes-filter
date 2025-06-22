import { EvaluateFilter } from '../evaluate-filter.interface'

export class GreaterThanFilter implements EvaluateFilter {
  private referenceValue: any

  constructor(value: any) {
    this.referenceValue = value
  }

  evaluate(data: any): boolean {
    if (data === null || data === undefined) return false
    if (this.referenceValue === null || this.referenceValue === undefined)
      return false

    // Si ambos valores son fechas o pueden ser convertidos a fechas, usar lógica de fechas
    if (this.isDateLike(data) && this.isDateLike(this.referenceValue)) {
      const dateValue = new Date(data)
      const refDate = new Date(this.referenceValue)

      if (isNaN(dateValue.getTime()) || isNaN(refDate.getTime())) return false
      return dateValue > refDate
    }

    // Para strings, usar comparación lexicográfica
    if (typeof data === 'string' && typeof this.referenceValue === 'string') {
      return data > this.referenceValue
    }

    // Para números, usar comparación numérica
    if (typeof data === 'number' && typeof this.referenceValue === 'number') {
      return data > this.referenceValue
    }

    // Para comparaciones mixtas, intentar convertir a números primero
    if (typeof data === 'string' && typeof this.referenceValue === 'number') {
      const numData = parseFloat(data)
      if (!isNaN(numData)) {
        return numData > this.referenceValue
      }
      // Si no es un número, usar comparación de strings
      return data > this.referenceValue.toString()
    }

    if (typeof data === 'number' && typeof this.referenceValue === 'string') {
      const numRef = parseFloat(this.referenceValue)
      if (!isNaN(numRef)) {
        return data > numRef
      }
      // Si no es un número, usar comparación de strings
      return data.toString() > this.referenceValue
    }

    // Para otros tipos, usar comparación directa
    return data > this.referenceValue
  }

  private isDateLike(value: any): boolean {
    return (
      value instanceof Date ||
      typeof value === 'string' ||
      typeof value === 'number'
    )
  }
}
