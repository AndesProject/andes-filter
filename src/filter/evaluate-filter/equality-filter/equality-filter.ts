import { EvaluateFilter } from '../evaluate-filter.interface'

export class EqualityFilter implements EvaluateFilter {
  constructor(
    private value: any,
    private insensitive: boolean = false
  ) {}

  evaluate(data: any): boolean {
    // Handle null equality: null equals null
    if (this.value === null && data === null) return true
    if (this.value === undefined && data === undefined) return true

    // If filter value is null/undefined but data is not, return false
    if (this.value === null || this.value === undefined) return false
    if (data === null || data === undefined) return false

    // Handle string comparison with insensitive mode
    if (typeof this.value === 'string' && typeof data === 'string') {
      if (this.insensitive) {
        return this.value.toLowerCase() === data.toLowerCase()
      }
      return this.value === data
    }

    // Handle Date comparison - compare by value, not reference (like Prisma/TypeORM)
    if (this.value instanceof Date && data instanceof Date) {
      return this.value.getTime() === data.getTime()
    }

    // Handle Date comparison when one is Date and other is string/number
    if (this.value instanceof Date || data instanceof Date) {
      const date1 =
        this.value instanceof Date ? this.value : new Date(this.value)
      const date2 = data instanceof Date ? data : new Date(data)
      return date1.getTime() === date2.getTime()
    }

    // Handle NaN comparison - NaN !== NaN in JavaScript (like Prisma/TypeORM)
    if (Number.isNaN(this.value) || Number.isNaN(data)) return false

    // Handle object comparison - compare by reference for objects and arrays (like Prisma/TypeORM)
    if (
      typeof this.value === 'object' &&
      this.value !== null &&
      typeof data === 'object' &&
      data !== null
    ) {
      return this.value === data
    }

    // Handle primitive comparison
    return data === this.value
  }
}
