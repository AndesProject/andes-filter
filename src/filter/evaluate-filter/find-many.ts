import { FindManyQueryResponse, QueryFilter } from '../filter.interface'
import { matchesFilter } from './matches-filter'

export function findMany<T>(
  filter: QueryFilter<T>,
  data: T[]
): FindManyQueryResponse<T> {
  const items = data.filter(item => matchesFilter(filter.where, item))

  return {
    data: items,
    pagination: { currentPage: 0, pageSize: 0, totalItems: 0, totalPages: 0 },
  }
}
