import { FilterQuery } from '../filter.interface'
import { matchesFilter } from './matches-filter'
export function findUnique<T>(
  filterQuery: FilterQuery<T>,
  dataSource: T[],
): T | null {
  return (
    dataSource.find((item) => matchesFilter(filterQuery.where, item)) ?? null
  )
}
