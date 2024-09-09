import { FilterKeys } from '../filter.interface'
import { EvaluateFilter } from './evaluate-filter.interface'
import { createFilterClassMap } from './evaluate-filter.map'
import { InsensitiveModeFilter } from './insensitive-mode-filter'

export class FilterEvaluator<T> {
  private filters: EvaluateFilter[] = []

  constructor(private filterKeys: FilterKeys<T, keyof T>) {
    this.initializeFilters()
  }

  private getFilterClass<T>(type: string, filter: any, insensitive?: boolean) {
    const key = type as keyof FilterKeys<T>
    return createFilterClassMap<T>(key, filter, insensitive)
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
        stringFilters.push(this.getFilterClass(key, value, true))
      } else {
        this.addFilterInstance(key, value)
      }
    })

    const modeFilterClass = new InsensitiveModeFilter(stringFilters)
    this.filters.push(modeFilterClass)
  }

  private addFilterInstance(key: string, value: any): void {
    const filterInstance = this.getFilterClass(key, value)
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
