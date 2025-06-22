import { FilterEvaluator } from '../evaluate-filter'
import { EvaluateFilter } from '../evaluate-filter.interface'
import { createFilterClassMap } from '../evaluate-filter.map'

export class NoneFilter implements EvaluateFilter {
  private evaluator: EvaluateFilter | null = null

  constructor(private filter: any) {
    // Si el filtro es un objeto con operadores directos, crear el filtro correspondiente
    if (typeof this.filter === 'object' && this.filter !== null) {
      const keys = Object.keys(this.filter)
      if (keys.length === 1) {
        const key = keys[0]
        const value = this.filter[key]
        // Si la key es un operador o una operación de array, usar el filtro correspondiente
        if (
          [
            'equals',
            'not',
            'in',
            'notIn',
            'lt',
            'lte',
            'gt',
            'gte',
            'contains',
            'notContains',
            'startsWith',
            'notStartsWith',
            'endsWith',
            'notEndsWith',
            'mode',
            'regex',
            'before',
            'after',
            'between',
            'has',
            'hasEvery',
            'hasSome',
            'length',
            'AND',
            'OR',
            'NOT',
            'isNull',
            'distinct',
            'some',
            'none',
            'every',
          ].includes(key)
        ) {
          this.evaluator = createFilterClassMap(key as any, value)
        } else {
          // Si la key no es un operador ni operación de array, crear FilterEvaluator
          this.evaluator = new FilterEvaluator(this.filter)
        }
      }
      // Si hay múltiples keys, es un subfiltro complejo, crear FilterEvaluator
      else if (keys.length > 1) {
        this.evaluator = new FilterEvaluator(this.filter)
      }
    }
  }

  evaluate(data: any): boolean {
    if (data === null || data === undefined) return true
    if (!Array.isArray(data)) return false
    if (data.length === 0) return true

    // Prisma: filtro vacío sobre array de objetos retorna false si hay al menos un objeto con propiedades, true si solo hay objetos vacíos, primitivos, null o undefined
    if (
      typeof this.filter === 'object' &&
      this.filter !== null &&
      Object.keys(this.filter).length === 0
    ) {
      let hasObjectWithProps = false
      let hasPrimitive = false
      for (const item of data) {
        if (item == null) continue
        if (typeof item === 'object') {
          if (Object.keys(item).length > 0) hasObjectWithProps = true
        } else {
          hasPrimitive = true
        }
      }
      // Si hay objetos con propiedades o primitivos, retornar false
      return !(hasObjectWithProps || hasPrimitive)
    }

    // Si no hay evaluador, usar comparación directa
    if (!this.evaluator) {
      return data.every((item) => item !== this.filter)
    }

    // Usar el evaluador para verificar que ningún elemento coincida
    return data.every((item) => {
      if (item == null) return true
      return !this.evaluator!.evaluate(item)
    })
  }
}
