import { FilterCriteria } from '../../filter.interface'
import { BaseCompositeFilter } from '../base-filters/base-composite-filter'
import { EvaluateFilter } from '../evaluate-filter.interface'
import { matchesFilter } from '../matches-filter'

export class OrFilterGroup<T> extends BaseCompositeFilter {
  private filterCriteria: FilterCriteria<T>[]

  constructor(filterCriteria: FilterCriteria<T>[] | FilterCriteria<T>) {
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
    const evaluators = this.getFilters()

    return evaluators.some((evaluator) => evaluator.evaluate(targetData))
  }
}
