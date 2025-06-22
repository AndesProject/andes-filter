import { FilterEvaluator } from '../evaluate-filter'
import { EvaluateFilter } from '../evaluate-filter.interface'

const OPERATORS = [
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
]

export class EveryFilter implements EvaluateFilter {
  private evaluator: EvaluateFilter | FilterEvaluator<any> | null = null
  private isPrimitive: boolean = false
  private isSimpleObject: boolean = false
  private isEmptyFilter: boolean = false

  constructor(private filter: any) {
    // Check if it's an empty filter
    if (
      typeof this.filter === 'object' &&
      this.filter !== null &&
      Object.keys(this.filter).length === 0
    ) {
      this.isEmptyFilter = true
      return
    }

    // Si el filtro es un objeto con múltiples claves que no son operadores, usar comparación directa
    if (
      typeof this.filter === 'object' &&
      this.filter !== null &&
      Object.keys(this.filter).length > 0
    ) {
      const keys = Object.keys(this.filter)

      // Verificar si es un filtro de operador (solo una clave que es un operador)
      if (keys.length === 1 && OPERATORS.includes(keys[0])) {
        // Es un filtro de operador, usar FilterEvaluator
        this.evaluator = new FilterEvaluator(this.filter)
      } else {
        // Verificar si todas las claves son operadores
        const allKeysAreOperators = keys.every((key) => OPERATORS.includes(key))
        if (allKeysAreOperators) {
          // Es un filtro de operadores múltiples, usar FilterEvaluator
          this.evaluator = new FilterEvaluator(this.filter)
        } else {
          // Es un objeto simple con valores primitivos, usar comparación directa
          const hasOnlyPrimitiveValues = keys.every(
            (key) =>
              typeof this.filter[key] !== 'object' || this.filter[key] === null
          )
          if (hasOnlyPrimitiveValues) {
            this.isSimpleObject = true
          } else {
            this.evaluator = new FilterEvaluator(this.filter)
          }
        }
      }
    } else if (typeof this.filter !== 'object' || this.filter === null) {
      this.isPrimitive = true
    }
  }

  evaluate(data: any): boolean {
    if (!Array.isArray(data)) return false

    // Prisma/TypeORM behavior: empty array always returns true (vacuous truth)
    if (data.length === 0) {
      return true
    }

    // If the filter is empty, return true for all arrays (Prisma/TypeORM behavior)
    if (this.isEmptyFilter) {
      return true
    }

    return data.every((item) => {
      if (item == null) return false

      if (this.isSimpleObject) {
        // Comparación directa de objetos
        if (typeof item !== 'object' || item === null) return false
        return Object.keys(this.filter).every(
          (key) => item[key] === this.filter[key]
        )
      }

      if (this.evaluator) {
        return this.evaluator.evaluate(item)
      }

      if (this.isPrimitive) {
        return item === this.filter
      }

      return false
    })
  }
}
