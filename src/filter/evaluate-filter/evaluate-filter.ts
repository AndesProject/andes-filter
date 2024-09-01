import { FilterKeys } from '../filter.interface'
import { EvaluateFilter } from './evaluate-filter.interface'
import { createFilterClassMap } from './evaluate-filter.map'
import { StringInsensitiveModeFilter } from './string-insensitive-mode-filter'

export class FilterEvaluator<T> {
  private filters: EvaluateFilter[] = []

  constructor(private filterKeys: FilterKeys<T, keyof T>) {
    this.initializeFilters()
  }

  private getFilterClass(key: string) {
    const typedKey = key as keyof FilterKeys<T, keyof T>
    const filterClassMap = createFilterClassMap<T>()
    return filterClassMap[typedKey]
  }

  private getFilterInstance(key: string, value: any): EvaluateFilter | null {
    const FilterClass = this.getFilterClass(key)
    if (!FilterClass) return null

    const filterInstance: EvaluateFilter = new FilterClass(value)
    return filterInstance
  }

  private initializeFilters(): void {
    if (Object.keys(this.filterKeys).includes('mode')) {
      this.handleModeKey()
    } else {
      this.processFilters()
    }
  }

  private handleModeKey(): void {
    const stringFilters: EvaluateFilter[] = []
    const stringFilterKeys: string[] = [
      'contains',
      'notContains',
      'startsWith',
      'notStartsWith',
      'endsWith',
      'notEndsWith',
    ]
    const filterKeys = Object.keys(this.filterKeys).filter(key => key !== 'mode')

    filterKeys.forEach(key => {
      const value = this.getFilterKeyValue(key)
      if (stringFilterKeys.includes(key)) {
        const FilterInstance = this.getFilterClass(key)
        stringFilters.push(new FilterInstance(value, true))
      } else {
        this.addFilterInstance(key, value)
      }
    })

    const modeFilterClass = new StringInsensitiveModeFilter(stringFilters)
    this.filters.push(modeFilterClass)
  }

  private addFilterInstance(key: string, value: any): void {
    const filterInstance = this.getFilterInstance(key, value)
    if (filterInstance) {
      this.filters.push(filterInstance)
    }
  }

  private getFilterKeyValue(key: string): any {
    const typedKey = key as keyof FilterKeys<T, keyof T>
    return this.filterKeys[typedKey]
  }

  private processFilters(): void {
    Object.keys(this.filterKeys).forEach((key: string) => {
      const value = this.getFilterKeyValue(key)
      this.addFilterInstance(key, value)
    })
  }

  evaluate(value: T): boolean {
    return this.filters.every(filter => filter.evaluate(value))
  }
}
