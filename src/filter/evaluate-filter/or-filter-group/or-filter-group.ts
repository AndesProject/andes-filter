import { FilterCriteria } from '../../filter.interface'
import { anyItemMatches } from '../../utils/filter.helpers'
import { BaseCompositeFilter } from '../base-filters/base-composite-filter'
import { EvaluateFilter } from '../evaluate-filter.interface'
import { matchesFilter } from '../matches-filter'

export class OrFilterGroup<T> extends BaseCompositeFilter {
  private filterCriteria: FilterCriteria<T, keyof T>[]

  constructor(
    filterCriteria: FilterCriteria<T, keyof T>[] | FilterCriteria<T, keyof T>
  ) {
    // Permitir tanto array como objeto único
    const criteriaArray = Array.isArray(filterCriteria)
      ? filterCriteria
      : [filterCriteria]
    const filters: EvaluateFilter[] = criteriaArray.map((criteria) => ({
      evaluate: (data: any) => matchesFilter(criteria, data),
    }))
    super(filters)
    this.filterCriteria = criteriaArray
  }

  public evaluate(targetData: any): boolean {
    if (!this.validateFilters()) return false
    return anyItemMatches(this.filterCriteria, (criteria) =>
      matchesFilter(criteria, targetData)
    )
  }
}
