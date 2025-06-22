import { EvaluateFilter } from '../evaluate-filter.interface'

export class GreaterThanFilter implements EvaluateFilter {
  private referenceValue: any

  constructor(value: any) {
    this.referenceValue = value
  }

  evaluate(data: any): boolean {
    // Handle null/undefined cases - Prisma/TypeORM behavior
    if (data === null || data === undefined) return false
    if (this.referenceValue === null || this.referenceValue === undefined)
      return false

    // Handle NaN cases - Prisma/TypeORM behavior
    if (typeof data === 'number' && Number.isNaN(data)) return false
    if (
      typeof this.referenceValue === 'number' &&
      Number.isNaN(this.referenceValue)
    )
      return false

    // Handle number comparisons (including floating point)
    if (typeof data === 'number' && typeof this.referenceValue === 'number') {
      return Number(data) > Number(this.referenceValue)
    }

    // Handle Date comparisons - compare by value, not reference
    if (this.isDateLike(data) && this.isDateLike(this.referenceValue)) {
      const dateValue = new Date(data)
      const refDate = new Date(this.referenceValue)
      if (isNaN(dateValue.getTime()) || isNaN(refDate.getTime())) return false
      return dateValue.getTime() > refDate.getTime()
    }

    // Handle string comparisons - use lexicographic comparison
    if (typeof data === 'string' && typeof this.referenceValue === 'string') {
      // Si ambos strings parecen fechas, comparar como fechas
      const dateA = new Date(data)
      const dateB = new Date(this.referenceValue)
      const isDateA = !isNaN(dateA.getTime())
      const isDateB = !isNaN(dateB.getTime())
      if (isDateA && isDateB) {
        return dateA.getTime() > dateB.getTime()
      }
      if (isDateA !== isDateB) {
        // Si uno es fecha válida y el otro no, retorna false (no comparable)
        return false
      }
      // Si ninguno es fecha válida, comparar como string
      return data > this.referenceValue
    }

    // Handle mixed type comparisons
    if (typeof data === 'string' && typeof this.referenceValue === 'number') {
      const numData = parseFloat(data)
      if (!isNaN(numData)) {
        return numData > this.referenceValue
      }
      // If string cannot be converted to number, use string comparison
      return data > this.referenceValue.toString()
    }

    if (typeof data === 'number' && typeof this.referenceValue === 'string') {
      const numRef = parseFloat(this.referenceValue)
      if (!isNaN(numRef)) {
        return data > numRef
      }
      // If reference cannot be converted to number, use string comparison
      return data.toString() > this.referenceValue
    }

    // For other types, try to convert to comparable values
    try {
      return data > this.referenceValue
    } catch {
      return false
    }
  }

  private isDateLike(value: any): boolean {
    if (value instanceof Date) return true
    if (typeof value === 'number') return !isNaN(value) && value > 0
    if (typeof value === 'string') {
      const date = new Date(value)
      return !isNaN(date.getTime())
    }
    return false
  }
}
