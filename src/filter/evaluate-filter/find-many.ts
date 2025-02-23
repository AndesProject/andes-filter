import {
  FindManyQueryResponse,
  QueryFilter,
  QueryFilterPagination,
} from '../filter.interface'
import { matchesFilter } from './matches-filter'
import { paginateArray } from './paginator'
import { sortObjects } from './sort-objects'

export function findMany<T>(
  filter: QueryFilter<T>,
  data: T[]
): FindManyQueryResponse<T> {
  const result = data.filter(item => matchesFilter(filter.where, item))
  const items = sortObjects(result, filter.orderBy || {})
  return paginateArray(items, getQueryFilterPagination(filter))
}

function getQueryFilterPagination<T>(
  filter: QueryFilter<T>
): QueryFilterPagination {
  return filter?.pagination || { page: 1, size: 24 }
}
