import { evaluateFilter } from '../evaluate-filter'
import { FilterOptions } from '../filter.interface'

export function findUnique<T>(options: FilterOptions<T>, data: T[]): T | null {
  return (
    data.find(item =>
      Object.keys(options.where).every(key => {
        const filter = options.where[key as keyof T]
        const value = item[key as keyof T]
        return filter ? evaluateFilter(filter, value) : true
      })
    ) ?? null
  )
}
