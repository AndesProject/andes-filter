import { QueryOption } from '../filter.interface'
import { createFilterInstance } from './'

export function matchesFilter<T>(filter: QueryOption<T>, data: any): boolean {
  return Object.keys(filter).every(key => {
    const filterKey = filter[key as keyof QueryOption<T>]
    const value = data[key]
    return filterKey ? createFilterInstance(filterKey, value) : true
  })
}
