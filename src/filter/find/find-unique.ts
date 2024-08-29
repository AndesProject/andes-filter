import { createFilterInstance } from '../evaluate-filter'
import { FilterOptions } from '../filter.interface'

export function findUnique<T>(filter: FilterOptions<T>, data: T[]): T | null {
  return (
    data.find(item =>
      Object.keys(filter.where).every(key => {
        const filterKey = filter.where[key as keyof T]
        const value = item[key as keyof T]
        return filterKey ? createFilterInstance(filterKey, value) : true
      })
    ) ?? null
  )
}
