import { FilterQuery } from '../filter.interface'
import { matchesFilter } from './matches-filter'

export function findUnique<T>(filter: FilterQuery<T>, data: T[]): T | null {
  return data.find(item => matchesFilter(filter.where, item)) ?? null
}
