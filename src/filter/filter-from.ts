import { findMany } from './evaluate-filter/find-many'
import { findUnique } from './evaluate-filter/find-unique'
import { FilterOperations, FilterQuery } from './filter.interface'
export function createFilterEngine<T>(dataSource: T[]): FilterOperations<T> {
  return {
    findMany: (query: FilterQuery<T>) => findMany(query, dataSource),
    findUnique: (query: FilterQuery<T>) => findUnique(query, dataSource),
  }
}
