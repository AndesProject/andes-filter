import { EvaluateFilter } from '../evaluate-filter.interface'

export class InsensitiveModeFilter implements EvaluateFilter {
  constructor(private filters: EvaluateFilter[]) {}

  evaluate(value: any): boolean {
    // Si no hay filtros, retorna true
    if (!this.filters || this.filters.length === 0) return true

    // Si el valor es null o undefined, retorna false
    if (value == null) return false

    // Evalúa todos los filtros con lógica AND
    return this.filters.every(filter => filter.evaluate(value))
  }
}
