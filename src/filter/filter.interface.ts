export const CASE_INSENSITIVE_MODE = 'insensitive' as const
export type DateOrNumber = Date | number | string
export interface FilterCriteria<T, K extends keyof T = keyof T> {
  equals?: T[K] | null
  not?: T[K] | FilterCriteria<T, K> | null
  in?: T[K][]
  notIn?: T[K][]
  lt?: T[K]
  lte?: T[K]
  gt?: T[K]
  gte?: T[K]
  contains?: T[K] extends string ? string : never
  notContains?: T[K] extends string ? string : never
  startsWith?: T[K] extends string ? string : never
  notStartsWith?: T[K] extends string ? string : never
  endsWith?: T[K] extends string ? string : never
  notEndsWith?: T[K] extends string ? string : never
  mode?: T[K] extends string ? typeof CASE_INSENSITIVE_MODE : never
  regex?: T[K] extends string
    ? string | { pattern: string; flags?: string }
    : never
  before?: T[K] extends DateOrNumber ? DateOrNumber : never
  after?: T[K] extends DateOrNumber ? DateOrNumber : never
  between?: T[K] extends DateOrNumber ? [DateOrNumber, DateOrNumber] : never
  some?: T[K] extends object ? FilterCriteria<T[K], keyof T[K]> : never
  none?: T[K] extends object ? FilterCriteria<T[K], keyof T[K]> : never
  every?: T[K] extends object ? FilterCriteria<T[K], keyof T[K]> : never
  has?: T[K] extends Array<infer U> ? U : never
  hasEvery?: T[K] extends Array<infer U> ? U[] : never
  hasSome?: T[K] extends Array<infer U> ? U[] : never
  length?: T[K] extends Array<any> ? number : never
  AND?: FilterCriteria<T, K>[]
  OR?: FilterCriteria<T, K>[]
  NOT?: FilterCriteria<T, K>[]
  isNull?: boolean
  distinct?: boolean
}
export interface PaginationOptions {
  page: number
  size: number
}
export interface PaginationResult extends PaginationOptions {
  totalItems: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}
export interface FindManyResult<T> {
  data: T[]
  pagination?: PaginationResult
}
export type FindUniqueResult<T> = T | null
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}
export type FilterQuery<T> = {
  where: {
    [K in keyof T]?: FilterCriteria<T, K>
  }
  pagination?: PaginationOptions
  orderBy?: { [K in keyof T]?: SortDirection }
  distinct?: boolean | string | string[]
}
export interface FilterOperations<T> {
  findMany: (query: FilterQuery<T>) => FindManyResult<T>
  findUnique: (query: FilterQuery<T>) => FindUniqueResult<T>
}
