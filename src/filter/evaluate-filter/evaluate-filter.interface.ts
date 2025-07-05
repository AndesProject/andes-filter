// Interfaz base para todos los filtros
export interface EvaluateFilter {
  evaluate(value: any): boolean
}

// Interfaces específicas para diferentes tipos de filtros
export interface ComparisonFilter extends EvaluateFilter {
  // Filtros que comparan valores directamente
}

export interface StringFilter extends EvaluateFilter {
  // Filtros específicos para operaciones de string
}

export interface NumericFilter extends EvaluateFilter {
  // Filtros específicos para operaciones numéricas
}

export interface DateFilter extends EvaluateFilter {
  // Filtros específicos para operaciones de fecha
}

export interface ArrayFilter extends EvaluateFilter {
  // Filtros específicos para operaciones de array
}

export interface LogicalFilter extends EvaluateFilter {
  // Filtros que combinan otros filtros lógicamente
}

export interface UtilityFilter extends EvaluateFilter {
  // Filtros de utilidad (null, distinct, etc.)
}
