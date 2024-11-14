import { findMany } from './evaluate-filter/find-many'
import { findUnique } from './evaluate-filter/find-unique'
import { FilterQuery } from './filter.interface'

export function filterFrom<T>(data: T[]) {
  return {
    findMany: (options: FilterQuery<T>) => findMany(options, data),
    findUnique: (options: FilterQuery<T>) => findUnique(options, data),
  }
}
