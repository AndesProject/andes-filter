import { EvaluateFilter } from '../evaluate-filter.interface'

export class InclusionFilter<T> implements EvaluateFilter {
  private insensitive: boolean = false

  constructor(
    private targetValues: T[],
    insensitive?: boolean
  ) {
    this.insensitive = !!insensitive
  }

  evaluate(value: T): boolean {
    // Prisma/TypeORM: in: [] nunca retorna nada
    if (!Array.isArray(this.targetValues) || this.targetValues.length === 0)
      return false

    for (const v of this.targetValues) {
      // NaN
      if (
        typeof value === 'number' &&
        typeof v === 'number' &&
        Number.isNaN(value) &&
        Number.isNaN(v)
      ) {
        return true
      }
      // Fechas por valor
      if (value instanceof Date && v instanceof Date) {
        if (value.getTime() === v.getTime()) return true
        continue
      }
      // null y undefined - comparación estricta
      if (value === null && v === null) {
        return true
      }
      if (value === undefined && v === undefined) {
        return true
      }
      // Objetos por referencia (no deep equality)
      if (
        typeof value === 'object' &&
        value !== null &&
        typeof v === 'object' &&
        v !== null
      ) {
        if (value === v) return true
        continue
      }
      // Strings con modo insensible
      if (typeof value === 'string' && typeof v === 'string') {
        if (this.insensitive) {
          if (value.toLowerCase() === v.toLowerCase()) return true
        } else {
          if (value === v) return true
        }
        continue
      }
      // Primitivos (case-sensitive)
      if (value === v) return true
    }
    return false
  }
}
