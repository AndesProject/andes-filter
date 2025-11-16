import { EvaluateFilter } from '../evaluate-filter.interface'

// Interfaces específicas para diferentes responsabilidades
export interface FilterCollection {
  getFilters(): EvaluateFilter[]
  getFilterCount(): number
  validateFilters(): boolean
}

export interface FilterModification {
  addFilter(filter: EvaluateFilter): void
  removeFilter(filter: EvaluateFilter): void
  clearFilters(): void
}

export interface FilterEvaluation {
  evaluate(data: any): boolean
}

// Interfaz que combina todas las responsabilidades
export interface CompositeFilter
  extends FilterCollection,
    FilterModification,
    FilterEvaluation {}

// Clase base que implementa las interfaces específicas
export abstract class BaseCompositeFilter implements CompositeFilter {
  protected constructor(protected filters: EvaluateFilter[]) {}

  public abstract evaluate(data: any): boolean

  // Implementación de FilterCollection
  public validateFilters(): boolean {
    return this.filters && this.filters.length > 0
  }

  public getFilters(): EvaluateFilter[] {
    return this.filters || []
  }

  public getFilterCount(): number {
    return this.filters.length
  }

  // Implementación de FilterModification
  public addFilter(filter: EvaluateFilter): void {
    this.filters.push(filter)
  }

  public removeFilter(filter: EvaluateFilter): void {
    const index = this.filters.indexOf(filter)

    if (index > -1) {
      this.filters.splice(index, 1)
    }
  }

  public clearFilters(): void {
    this.filters = []
  }
}
