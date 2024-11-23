import { QueryFilter, QueryOption } from '../../filter.interface'
import { EvaluateFilter } from '../evaluate-filter.interface'
import { findUnique } from '../find-unique'

export class SomeFilter<T> implements EvaluateFilter {
  constructor(private filterKeys: QueryOption<T>) {}

  evaluate(data: T[]): boolean {
    const filter = { where: this.filterKeys } as QueryFilter<T>
    const isValid: boolean = Boolean(findUnique(filter, data))
    return isValid
  }
}
