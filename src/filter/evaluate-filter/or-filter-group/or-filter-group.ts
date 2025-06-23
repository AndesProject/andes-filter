import { FilterCriteria } from '../../filter.interface'
import { anyItemMatches } from '../../utils/filter.helpers'
import { EvaluateFilter } from '../evaluate-filter.interface'
import { matchesFilter } from '../matches-filter'

export class OrFilterGroup<T> implements EvaluateFilter {
  private filterCriteria: FilterCriteria<T, keyof T>[]

  constructor(filterCriteria: FilterCriteria<T, keyof T>[]) {
    this.filterCriteria = filterCriteria
  }

  evaluate(targetData: any): boolean {
    if (!this.filterCriteria || this.filterCriteria.length === 0) return false
    return anyItemMatches(this.filterCriteria, (criteria) =>
      matchesFilter(criteria, targetData)
    )
  }
}
