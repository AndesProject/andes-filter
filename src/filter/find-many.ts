import { evaluateFilter } from './evaluate-filter'
import { FilterOptions } from './filter.interface'

export function findMany<T>(options: FilterOptions<T>, data: T[]): T[] {
  return data.filter(item => {
    return Object.keys(options.where).every(key => {
      const filter = options.where[key as keyof T]
      const value = item[key as keyof T]
      return filter ? evaluateFilter(filter, value) : true
    })
  })
}
