import { FilterEvaluator } from '../evaluate-filter'
import { EvaluateFilter } from '../evaluate-filter.interface'
import { createFilterClassMap } from '../evaluate-filter.map'

export class SomeFilter implements EvaluateFilter {
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
    if (!Array.isArray(data)) return false
    if (data.length === 0) return false

    // Prisma: filtro vacío sobre array de objetos retorna true si hay al menos un objeto
    if (
      typeof this.filter === 'object' &&
      this.filter !== null &&
      Object.keys(this.filter).length === 0
    ) {
      // Si el array contiene objetos
      if (typeof data[0] === 'object' && data[0] !== null) return true
      // Si el array contiene primitivos
      return false
    }

    // Si el filtro es un objeto complejo (no solo un operador), usar FilterEvaluator
    const isComplexObject =
      typeof this.filter === 'object' &&
      this.filter !== null &&
      (Object.keys(this.filter).length > 1 ||
        (Object.keys(this.filter).length === 1 &&
          ![
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
          ].includes(Object.keys(this.filter)[0])))

    let complexEvaluator: FilterEvaluator<any> | null = null
    if (isComplexObject) {
      complexEvaluator = new FilterEvaluator(this.filter)
    }

    return data.some((item) => {
      if (item == null) return false
      if (this.evaluator) {
        return this.evaluator.evaluate(item)
      }
      return item === this.filter
    })
  }
}
