import { QueryOption } from '../filter.interface'
import { AndFilterGroup } from './and-filter-group'
import { FilterEvaluator } from './evaluate-filter'
import { NotFilterGroup } from './not-filter-group'
import { OrFilterGroup } from './or-filter-group'

const GROUP_KEYS = ['AND', 'OR', 'NOT', 'some', 'every', 'none']
const ARRAY_FILTER_KEYS = ['has', 'hasEvery', 'hasSome', 'length']

export function matchesFilter<T = any>(
  filter: QueryOption<T, keyof T>,
  data: any
): boolean {
  if (!filter || typeof filter !== 'object') return false

  // Si el filtro es un grupo lógico
  if (filter.AND) {
    if (Array.isArray(filter.AND) && filter.AND.length === 0) return true
    const andGroup = new AndFilterGroup(filter.AND)
    return andGroup.evaluate(data)
  }
  if (filter.OR) {
    const orGroup = new OrFilterGroup(filter.OR)
    return orGroup.evaluate(data)
  }
  if (filter.NOT) {
    const notGroup = new NotFilterGroup(filter.NOT)
    return notGroup.evaluate(data)
  }

  // Si el filtro es un filtro de array
  for (const key of Object.keys(filter)) {
    if (ARRAY_FILTER_KEYS.includes(key)) {
      const evaluator = new FilterEvaluator(filter)
      return evaluator.evaluate(data)
    }
  }

  // Si el filtro tiene campos, usa FilterEvaluator
  const fieldKeys = Object.keys(filter).filter(
    (key) => !GROUP_KEYS.includes(key) && !ARRAY_FILTER_KEYS.includes(key)
  )
  if (fieldKeys.length > 0) {
    const evaluator = new FilterEvaluator(filter)
    return evaluator.evaluate(data)
  }

  // Si el filtro está completamente vacío, retorna true
  return true
}
