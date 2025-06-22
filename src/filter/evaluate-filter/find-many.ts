import {
  FindManyQueryResponse,
  QueryFilter,
  QueryFilterPagination,
} from '../filter.interface'
import { matchesFilter } from './matches-filter'
import { paginateArray } from './paginator'
import { sortObjects } from './sort-objects'

function distinctArray<T>(
  arr: T[],
  distinct?: boolean | string | string[]
): T[] {
  if (!distinct) return arr
  if (distinct === true) {
    // Distinct por todo el objeto (referencia)
    const seen = new Set()
    return arr.filter(item => {
      const key = JSON.stringify(item)
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }
  const fields = Array.isArray(distinct) ? distinct : [distinct]
  const seen = new Set()
  return arr.filter(item => {
    const key = fields
      .map(f =>
        JSON.stringify(
          item && typeof item === 'object' ? item[f as keyof T] : undefined
        )
      )
      .join('|')
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function findMany<T>(
  filter: QueryFilter<T>,
  data: T[]
): FindManyQueryResponse<T> {
  const result = data.filter(item => {
    // Siempre pasar el filtro completo y el objeto completo
    return matchesFilter(filter.where as any, item)
  })

  const distincted = distinctArray(result, (filter as any).distinct)
  const items = sortObjects(distincted, filter.orderBy || {})
  return paginateArray(items, getQueryFilterPagination(filter))
}

function getQueryFilterPagination<T>(
  filter: QueryFilter<T>
): QueryFilterPagination {
  return filter?.pagination || { page: 1, size: 24 }
}
