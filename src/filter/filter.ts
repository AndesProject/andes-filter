import { FilterOptions } from './filter.interface'
import { findMany } from './find-many'
import { findUnique } from './find-unique'

export function filterFrom<T>(data: T[]) {
  return {
    findMany: (options: FilterOptions<T>) => findMany(options, data),
    findUnique: (options: FilterOptions<T>) => findUnique(options, data),
  }
}
