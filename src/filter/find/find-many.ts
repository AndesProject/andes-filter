import { createFilterInstance } from '../evaluate-filter'
import { FilterOptions } from '../filter.interface'

export function findMany<T>(filter: FilterOptions<T>, data: T[]): T[] {
  return data.filter(item => {
    return Object.keys(filter.where).every(key => {
      const filterKey = filter.where[key as keyof T]
      const value = item[key as keyof T]
      return filterKey ? createFilterInstance(filterKey, value) : true
    })
  })
}
