import {
  FindManyQueryResponse,
  QueryFilterPagination,
} from '@app/filter/filter.interface'

export function paginateArray<T>(
  items: T[],
  pagination: QueryFilterPagination
): FindManyQueryResponse<T> {
  const { page, size } = pagination

  if (page < 1 || size < 1) {
    throw new Error('Page and size must be greater than zero.')
  }

  const startIndex = (page - 1) * size
  const endIndex = startIndex + size
  const paginatedItems = items.slice(startIndex, endIndex)

  return {
    data: paginatedItems,
    pagination: {
      page: page,
      size: size,
      totalItems: items.length,
      totalPages: Math.ceil(items.length / size),
      hasNext: endIndex < items.length,
      hasPrev: startIndex > 0,
    },
  }
}
