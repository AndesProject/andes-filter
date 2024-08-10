import { FilterKeys } from '../filter.interface'
import { FilterEvaluator } from './evaluate-filter'

export function evaluateFilter<T>(filterKeys: FilterKeys<T>, value: any): boolean {
  const evaluator = new FilterEvaluator(filterKeys)
  return evaluator.evaluate(value)
}
