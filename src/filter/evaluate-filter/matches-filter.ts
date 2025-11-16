import { FilterCriteria } from '../filter.interface'
import { AndFilterGroup } from './and-filter-group'
import { FilterEvaluator } from './evaluate-filter'
import { NotFilterGroup } from './not-filter-group'
import { OrFilterGroup } from './or-filter-group'

const LOGICAL_GROUP_KEYS = ['AND', 'OR', 'NOT', 'some', 'every', 'none']

const ARRAY_OPERATION_KEYS = ['has', 'hasEvery', 'hasSome', 'length']

export function matchesFilter<T = any>(
  filterCriteria: FilterCriteria<T>,
  targetData: any,
): boolean {
  if (!filterCriteria || typeof filterCriteria !== 'object') return false
  if (filterCriteria.AND) {
    if (Array.isArray(filterCriteria.AND) && filterCriteria.AND.length === 0)
      return true
    const andGroupEvaluator = new AndFilterGroup(filterCriteria.AND)

    return andGroupEvaluator.evaluate(targetData)
  }

  if (filterCriteria.OR) {
    const orGroupEvaluator = new OrFilterGroup(filterCriteria.OR)

    return orGroupEvaluator.evaluate(targetData)
  }

  if (filterCriteria.NOT) {
    const notGroupEvaluator = new NotFilterGroup(filterCriteria.NOT)

    return notGroupEvaluator.evaluate(targetData)
  }

  for (const filterKey of Object.keys(filterCriteria)) {
    if (ARRAY_OPERATION_KEYS.includes(filterKey)) {
      const arrayEvaluator = new FilterEvaluator(filterCriteria)

      return arrayEvaluator.evaluate(targetData)
    }
  }

  const fieldFilterKeys = Object.keys(filterCriteria).filter(
    (key) =>
      !LOGICAL_GROUP_KEYS.includes(key) && !ARRAY_OPERATION_KEYS.includes(key),
  )

  if (fieldFilterKeys.length > 0) {
    const fieldEvaluator = new FilterEvaluator(filterCriteria)

    return fieldEvaluator.evaluate(targetData)
  }

  return true
}
