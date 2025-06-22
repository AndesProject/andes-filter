import { FilterEvaluator } from '../evaluate-filter'
import { EvaluateFilter } from '../evaluate-filter.interface'
import { matchesFilter } from '../matches-filter'

export class HasEveryFilter<T> implements EvaluateFilter {
  private filterEvaluators: FilterEvaluator<any>[] = []

  constructor(private targetValues: T[]) {
    // Si los valores objetivo son objetos complejos, crear FilterEvaluators
    if (
      this.targetValues.length > 0 &&
      typeof this.targetValues[0] === 'object' &&
      this.targetValues[0] !== null
    ) {
      this.filterEvaluators = this.targetValues.map(
        (targetValue) => new FilterEvaluator(targetValue as any)
      )
    }
  }

  evaluate(value: any): boolean {
    if (value === null || value === undefined) return false
    if (!Array.isArray(value)) return false
    if (value.length === 0) return this.targetValues.length === 0 // Si el array está vacío, solo pasa si no hay elementos requeridos

    // Si no hay elementos requeridos, siempre pasa
    if (this.targetValues.length === 0) return true

    // CASO CORRECTO: Si el filtro es un solo objeto, verificar que todos los elementos del array lo cumplan
    if (
      this.targetValues.length === 1 &&
      typeof this.targetValues[0] === 'object'
    ) {
      const evaluator = new FilterEvaluator(this.targetValues[0] as any)
      return value.every((item) => evaluator.evaluate(item))
    }

    // Si tenemos FilterEvaluators, verificar que todos los elementos requeridos cumplan la condición
    if (this.filterEvaluators.length > 0) {
      return this.filterEvaluators.every((evaluator) => {
        return value.some((item) => evaluator.evaluate(item))
      })
    }

    // Si los valores objetivo son objetos simples, usar matchesFilter para comparación
    if (
      this.targetValues.some(
        (target) => typeof target === 'object' && target !== null
      )
    ) {
      return this.targetValues.every((targetValue) => {
        return value.some((item) => matchesFilter(targetValue as any, item))
      })
    }

    // Para valores primitivos, verificar que todos los elementos requeridos estén en el array
    return this.targetValues.every((targetValue) => value.includes(targetValue))
  }
}
