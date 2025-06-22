import { EvaluateFilter } from '../evaluate-filter.interface'

export class RegexFilter implements EvaluateFilter {
  private pattern: string
  private flags: string | undefined

  constructor(pattern: string | { pattern: string; flags?: string }) {
    if (typeof pattern === 'string') {
      this.pattern = pattern
      this.flags = undefined
    } else {
      this.pattern = pattern.pattern
      this.flags = pattern.flags
    }
  }

  evaluate(input: any): boolean {
    if (input === null || input === undefined) return false
    if (typeof input !== 'string') return false

    try {
      const regex = new RegExp(this.pattern, this.flags)
      return regex.test(input)
    } catch (error) {
      // Prisma lanza error, pero aquí retornamos false para máxima seguridad
      return false
    }
  }
}
