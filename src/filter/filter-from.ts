import { findMany } from './evaluate-filter/find-many'
import { findUnique } from './evaluate-filter/find-unique'
import { FilterMethods, QueryFilter } from './filter.interface'

export function filterFrom<T>(data: T[]): FilterMethods<T> {
  return {
    findMany: (options: QueryFilter<T>) => findMany(options, data),
    findUnique: (options: QueryFilter<T>) => findUnique(options, data),
  }
}
