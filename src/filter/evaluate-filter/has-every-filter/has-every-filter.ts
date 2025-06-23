import {
  allItemsMatch,
  anyItemMatches,
  isObject,
} from '../../utils/filter.helpers'
import { FilterEvaluator } from '../evaluate-filter'
import { EvaluateFilter } from '../evaluate-filter.interface'
import { matchesFilter } from '../matches-filter'

export class HasEveryFilter<T> implements EvaluateFilter {
  private filterEvaluators: FilterEvaluator<any>[] = []

  constructor(private requiredValues: T[]) {
    // Si los valores objetivo son objetos complejos, crear FilterEvaluators
    if (
      this.requiredValues.length > 0 &&
      isObject(this.requiredValues[0]) &&
      this.requiredValues[0] !== null
    ) {
      this.filterEvaluators = this.requiredValues.map(
        (requiredValue) => new FilterEvaluator(requiredValue as any)
      )
    }
  }

  evaluate(arrayValue: any): boolean {
    if (!Array.isArray(arrayValue)) return false
    if (arrayValue.length === 0) return this.requiredValues.length === 0 // Si el array está vacío, solo pasa si no hay elementos requeridos

    // Si no hay elementos requeridos, siempre pasa
    if (this.requiredValues.length === 0) return true

    // CASO CORRECTO: Si el filtro es un solo objeto, verificar que todos los elementos del array lo cumplan
    if (this.requiredValues.length === 1 && isObject(this.requiredValues[0])) {
      const singleEvaluator = new FilterEvaluator(this.requiredValues[0] as any)
      return allItemsMatch(arrayValue, (item) => singleEvaluator.evaluate(item))
    }

    // Si tenemos FilterEvaluators, verificar que todos los elementos requeridos cumplan la condición
    if (this.filterEvaluators.length > 0) {
      return this.filterEvaluators.every((evaluator) => {
        return anyItemMatches(arrayValue, (item) => evaluator.evaluate(item))
      })
    }

    // Si los valores objetivo son objetos simples, usar matchesFilter para comparación
    if (
      this.requiredValues.some(
        (requiredValue) => isObject(requiredValue) && requiredValue !== null
      )
    ) {
      return this.requiredValues.every((requiredValue) => {
        return anyItemMatches(arrayValue, (item) =>
          matchesFilter(requiredValue as any, item)
        )
      })
    }

    // Para valores primitivos, verificar que todos los elementos requeridos estén en el array
    return this.requiredValues.every((requiredValue) =>
      arrayValue.includes(requiredValue)
    )
  }
}
