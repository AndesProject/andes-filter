import { FilterKeys } from '../filter.interface'
import { EvaluateFilter } from './evaluate-filter.interface'
import { createFilterClassMap } from './evaluate-filter.map'

export class FilterEvaluator<T> {
  private filters: EvaluateFilter[] = []

  constructor(private filterKeys: FilterKeys<T>) {
    this.initializeFilters()
  }

  private initializeFilters(): void {
    const filterClassMap = createFilterClassMap<T>()

    for (const key in this.filterKeys) {
      if (Object.hasOwn(this.filterKeys, key)) {
        const typedKey = key as keyof FilterKeys<T>
        const FilterClass = filterClassMap[typedKey]

        if (FilterClass) {
          this.filters.push(new FilterClass(this.filterKeys[typedKey]))
        }
      }
    }
  }

  evaluate(value: any): boolean {
    return this.filters.every(filter => filter.evaluate(value))
  }
}
