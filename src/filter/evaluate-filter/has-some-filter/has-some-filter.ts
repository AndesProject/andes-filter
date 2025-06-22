import { EvaluateFilter } from '../evaluate-filter.interface'
import { matchesFilter } from '../matches-filter'

export class HasSomeFilter<T> implements EvaluateFilter {
  constructor(private targetValues: T[]) {}

  evaluate(value: any): boolean {
    if (value === null || value === undefined) return false
    if (!Array.isArray(value)) return false
    if (value.length === 0) return this.targetValues.length === 0 // Si el array está vacío, solo pasa si no hay elementos requeridos

    // Si no hay elementos requeridos, siempre pasa
    if (this.targetValues.length === 0) return true

    // Si los valores objetivo son objetos, usar matchesFilter para comparación compleja
    if (
      this.targetValues.some(
        (target) => typeof target === 'object' && target !== null
      )
    ) {
      return this.targetValues.some((targetValue) => {
        return value.some((item) => matchesFilter(targetValue as any, item))
      })
    }

    // Para valores primitivos, usar comparación directa
    return this.targetValues.some((targetValue) => value.includes(targetValue))
  }
}
