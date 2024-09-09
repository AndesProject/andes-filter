import { FilterQuery } from '../filter.interface'
import { matchesFilter } from './matches-filter'

export function findMany<T>(filter: FilterQuery<T>, data: T[]): T[] {
  return data.filter(item => matchesFilter(filter.where, item))
}
