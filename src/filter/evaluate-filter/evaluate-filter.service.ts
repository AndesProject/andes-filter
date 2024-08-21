import { FilterKeys } from '../filter.interface'
import { FilterEvaluator } from './evaluate-filter'

export function createFilterInstance<T>(filterKeys: FilterKeys<T, keyof T>, value: any): boolean {
  const evaluator = new FilterEvaluator<T>(filterKeys)
  return evaluator.evaluate(value)
}
