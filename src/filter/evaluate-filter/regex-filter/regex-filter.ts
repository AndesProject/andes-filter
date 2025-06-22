import { EvaluateFilter } from '../evaluate-filter.interface'

export class RegexFilter implements EvaluateFilter {
  constructor(private pattern: string) {}

  evaluate(input: any): boolean {
    if (input === null || input === undefined) return false
    if (typeof input !== 'string') return false

    try {
      const regex = new RegExp(this.pattern)
      return regex.test(input)
    } catch (error) {
      return false // si el patrón de regex es inválido, retorna false
    }
  }
}
