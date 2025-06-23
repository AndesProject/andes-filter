import { FilterCriteria } from '../../filter.interface'
import { allItemsMatch } from '../../utils/filter.helpers'
import { EvaluateFilter } from '../evaluate-filter.interface'
import { matchesFilter } from '../matches-filter'

export class AndFilterGroup<T> implements EvaluateFilter {
  private filterCriteria: FilterCriteria<T, keyof T>[]

  constructor(filterCriteria: FilterCriteria<T, keyof T>[]) {
    this.filterCriteria = filterCriteria
  }

  evaluate(targetData: any): boolean {
    if (!this.filterCriteria || this.filterCriteria.length === 0) return true
    return allItemsMatch(this.filterCriteria, (criteria) =>
      matchesFilter(criteria, targetData)
    )
  }
}
