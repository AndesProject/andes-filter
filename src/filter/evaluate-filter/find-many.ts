import {
  FilterQuery,
  FindManyResult,
  PaginationOptions,
} from '../filter.interface'
import { matchesFilter } from './matches-filter'
import { paginateArray } from './paginator'
import { sortObjects } from './sort-objects'

function removeDuplicateItems<T>(
  items: T[],
  distinctOption?: boolean | string | string[]
): T[] {
  if (!distinctOption) return items
  if (distinctOption === true) {
    const seenItems = new Set()
    return items.filter((item) => {
      const itemKey = JSON.stringify(item)
      if (seenItems.has(itemKey)) return false
      seenItems.add(itemKey)
      return true
    })
  }
  const distinctFields = Array.isArray(distinctOption)
    ? distinctOption
    : [distinctOption]
  const seenFieldValues = new Set()
  return items.filter((item) => {
    const fieldKey = distinctFields
      .map((field) =>
        JSON.stringify(
          item && typeof item === 'object' ? item[field as keyof T] : undefined
        )
      )
      .join('|')
    if (seenFieldValues.has(fieldKey)) return false
    seenFieldValues.add(fieldKey)
    return true
  })
}

export function findMany<T>(
  filterQuery: FilterQuery<T>,
  dataSource: T[]
): FindManyResult<T> {
  const filteredItems = dataSource.filter((item) => {
    return matchesFilter(filterQuery.where as any, item)
  })

  const uniqueItems = removeDuplicateItems(
    filteredItems,
    (filterQuery as any).distinct
  )
  const sortedItems = sortObjects(uniqueItems, filterQuery.orderBy || {})
  return paginateArray(sortedItems, extractPaginationOptions(filterQuery))
}

function extractPaginationOptions<T>(
  filterQuery: FilterQuery<T>
): PaginationOptions {
  if (filterQuery?.pagination) {
    return filterQuery.pagination
  }

  const takeLimit = (filterQuery as any)?.take
  const skipOffset = (filterQuery as any)?.skip

  if (takeLimit !== undefined || skipOffset !== undefined) {
    const pageSize = takeLimit || 24
    const currentPage =
      skipOffset !== undefined ? Math.floor(skipOffset / pageSize) + 1 : 1
    return { page: currentPage, size: pageSize }
  }

  return { page: 1, size: 24 }
}
