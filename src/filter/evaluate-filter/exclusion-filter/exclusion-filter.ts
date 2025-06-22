import { EvaluateFilter } from '../evaluate-filter.interface'

export class ExclusionFilter<T> implements EvaluateFilter {
  private insensitive: boolean = false

  constructor(
    private targetValues: T[],
    insensitive?: boolean
  ) {
    this.insensitive = !!insensitive
  }

  evaluate(value: any): boolean {
    if (!Array.isArray(this.targetValues) || this.targetValues.length === 0)
      return true

    for (const v of this.targetValues) {
      // NaN
      if (
        typeof value === 'number' &&
        typeof v === 'number' &&
        Number.isNaN(value) &&
        Number.isNaN(v)
      ) {
        return false
      }
      // Fechas por valor
      if (value instanceof Date && v instanceof Date) {
        if (value.getTime() === v.getTime()) return false
        continue
      }
      // null y undefined - comparación estricta
      if (value === null && v === null) return false
      if (value === undefined && v === undefined) return false
      // Objetos por referencia (no deep equality)
      if (
        typeof value === 'object' &&
        value !== null &&
        typeof v === 'object' &&
        v !== null
      ) {
        if (value === v) return false
        continue
      }
      // Strings con modo insensible
      if (typeof value === 'string' && typeof v === 'string') {
        if (this.insensitive) {
          if (value.toLowerCase() === v.toLowerCase()) return false
        } else {
          if (value === v) return false
        }
        continue
      }
      // Primitivos (case-sensitive)
      if (value === v) return false
    }
    return true
  }
}
