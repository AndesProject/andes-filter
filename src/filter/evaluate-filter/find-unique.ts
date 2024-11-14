import { FilterOptions } from '../filter.interface'
import { matchesFilter } from './matches-filter'

export function findUnique<T>(filter: FilterOptions<T>, data: T[]): T | null {
  return data.find(item => matchesFilter(filter.where, item)) ?? null
}
