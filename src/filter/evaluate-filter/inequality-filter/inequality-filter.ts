import { QueryOption } from '../../filter.interface'
import { FilterEvaluator } from '../evaluate-filter'
import { EvaluateFilter } from '../evaluate-filter.interface'

export class InequalityFilter<T> implements EvaluateFilter {
  constructor(private targetValue: T | QueryOption<T> | null) {}

  evaluate(value: any): boolean {
    if (
      this.targetValue &&
      typeof this.targetValue === 'object' &&
      !Array.isArray(this.targetValue) &&
      this.targetValue !== null
    ) {
      // Si es un objeto (QueryOption), negar el resultado de evaluar ese filtro
      return !new FilterEvaluator(this.targetValue as QueryOption<T>).evaluate(
        value
      )
    }
    return value !== this.targetValue
  }
}
