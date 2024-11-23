import { QueryFilter } from '../filter.interface'
import { matchesFilter } from './matches-filter'

export function findUnique<T>(filter: QueryFilter<T>, data: T[]): T | null {
  return data.find(item => matchesFilter(filter.where, item)) ?? null
}
