import { QueryOption } from '../../filter.interface'
import { isObject, isString } from '../../utils/filter.helpers'
import { FilterEvaluator } from '../evaluate-filter'
import { EvaluateFilter } from '../evaluate-filter.interface'
import { createFilterClassMap } from '../evaluate-filter.map'
import { NoneFilter } from '../none-filter/none-filter'
import { SomeFilter } from '../some-filter/some-filter'

export class InequalityFilter<T> implements EvaluateFilter {
  private evaluator: EvaluateFilter | null = null
  private shouldNegate: boolean = false
  private insensitive: boolean = false
  private modeInsensitive: boolean = false
  private isDistinct: boolean = false
  private rawTarget: any = null
  private isArrayEquivalence: boolean = false

  constructor(
    private targetValue: T | QueryOption<T> | null,
    insensitive?: boolean
  ) {
    this.insensitive = !!insensitive
    this.rawTarget = targetValue
    // Detectar si el filtro tiene mode: 'insensitive' en la raíz
    if (
      isObject(targetValue) &&
      targetValue !== null &&
      'mode' in targetValue &&
      (targetValue as any).mode === 'insensitive'
    ) {
      this.modeInsensitive = true
    }
    if (
      this.targetValue &&
      isObject(this.targetValue) &&
      !Array.isArray(this.targetValue) &&
      this.targetValue !== null
    ) {
      const keys = Object.keys(this.targetValue)
      if (keys.length === 1) {
        const key = keys[0]
        const value = (this.targetValue as any)[key]
        if (key === 'distinct') {
          this.isDistinct = true
          return
        }
        // Equivalencias Prisma/TypeORM para not: { some/none/every }
        if (key === 'some') {
          this.evaluator = new NoneFilter(value)
          this.isArrayEquivalence = true
          return
        } else if (key === 'none') {
          this.evaluator = new SomeFilter(value)
          this.isArrayEquivalence = true
          return
        } else if (key === 'every') {
          // not: { every: F } ≡ some: { not: F }, pero debe retornar false para arrays vacíos
          this.evaluator = {
            evaluate: (arr: any) => {
              if (!Array.isArray(arr) || arr.length === 0) return false
              // Si todos cumplen F, retorna false; si alguno no cumple, retorna true
              return arr.some(
                (item: any) => !new FilterEvaluator(value).evaluate(item)
              )
            },
          }
          this.isArrayEquivalence = true
          return
        }
        let subInsensitive = this.insensitive || this.modeInsensitive
        if (
          isObject(value) &&
          value !== null &&
          'mode' in value &&
          value.mode === 'insensitive'
        ) {
          subInsensitive = true
        }
        this.evaluator = createFilterClassMap(key as any, value, subInsensitive)
      }
    }
  }

  evaluate(value: any): boolean {
    if (this.isDistinct) return false
    if (this.evaluator) {
      // Caso especial: NOT every (SomeFilter con not) sobre array vacío debe retornar false
      if (
        this.evaluator instanceof SomeFilter &&
        this.shouldNegate === false &&
        Array.isArray(value) &&
        value.length === 0
      ) {
        return false
      }
      // Si es equivalencia de array, no negar el resultado
      if (this.isArrayEquivalence) {
        return this.evaluator.evaluate(value)
      }
      // Para los demás casos, negar el resultado
      return !this.evaluator.evaluate(value)
    }
    // Si es un QueryOption, negar el resultado de evaluar ese filtro
    if (
      this.targetValue &&
      isObject(this.targetValue) &&
      !Array.isArray(this.targetValue) &&
      this.targetValue !== null &&
      Object.keys(this.targetValue).some((k) =>
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
        ].includes(k)
      )
    ) {
      // Propagar modo insensible si está presente
      let subInsensitive = this.insensitive || this.modeInsensitive
      if (
        'mode' in (this.targetValue as any) &&
        (this.targetValue as any).mode === 'insensitive'
      ) {
        subInsensitive = true
      }
      return !new FilterEvaluator(this.targetValue as QueryOption<T>).evaluate(
        value
      )
    }
    // Comparación de fechas por valor
    if (this.targetValue instanceof Date && value instanceof Date) {
      return this.targetValue.getTime() !== value.getTime()
    }
    // Comparación de fechas cuando uno es Date y otro string/number
    if (this.targetValue instanceof Date || value instanceof Date) {
      const date1 =
        this.targetValue instanceof Date
          ? this.targetValue
          : new Date(this.targetValue as any)
      const date2 = value instanceof Date ? value : new Date(value)
      return date1.getTime() !== date2.getTime()
    }
    // Comparación de NaN
    if (Number.isNaN(this.targetValue) || Number.isNaN(value))
      return !(Number.isNaN(this.targetValue) && Number.isNaN(value))
    // Comparación de strings con modo insensible
    if (isString(this.targetValue) && isString(value)) {
      if (this.insensitive || this.modeInsensitive) {
        return this.targetValue.toLowerCase() !== value.toLowerCase()
      }
      return this.targetValue !== value
    }
    // Comparación de objetos por referencia (no deep equality)
    if (
      isObject(this.targetValue) &&
      this.targetValue !== null &&
      isObject(value) &&
      value !== null
    ) {
      return this.targetValue !== value
    }
    // Comparación primitiva - NOT equals: retornar true cuando NO son iguales
    return value !== this.targetValue
  }
}
