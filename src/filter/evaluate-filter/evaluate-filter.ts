import { FilterKeys } from '../filter.interface'
import { EvaluateFilter } from './evaluate-filter.interface'
import { createFilterClassMap } from './evaluate-filter.map'

export class FilterEvaluator<T> {
  private filters: EvaluateFilter[] = []

  constructor(private filterKeys: FilterKeys<T, keyof T>) {
    this.initializeFilters()
  }

  private initializeFilters(): void {
    const filterClassMap = createFilterClassMap<T>()
    for (const key in this.filterKeys) {
      if (Object.hasOwn(this.filterKeys, key)) {
        const typedKey = key as keyof FilterKeys<T, keyof T>
        const FilterClass = filterClassMap[typedKey]

        if (FilterClass) {
          const filterInstance = new FilterClass(this.filterKeys[typedKey])
          if (filterInstance) {
            this.filters.push(filterInstance)
          }
        }
      }
    }
  }

  evaluate(value: any): boolean {
    return this.filters.every(filter => filter.evaluate(value))
  }
}
