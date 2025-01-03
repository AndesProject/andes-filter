import { FindManyQueryResponse, QueryFilter } from '../filter.interface'
import { matchesFilter } from './matches-filter'
import { sortObjects } from './sort-objects'

export function findMany<T>(
  filter: QueryFilter<T>,
  data: T[]
): FindManyQueryResponse<T> {
  const result = data.filter(item => matchesFilter(filter.where, item))
  const items = sortObjects(result, filter.orderBy || {})

  return {
    data: items,
    pagination: {
      currentPage: 0,
      pageSize: 0,
      totalItems: items.length,
      totalPages: 0,
    },
  }
}
