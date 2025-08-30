export const CASE_INSENSITIVE_MODE = 'insensitive' as const
export type DateOrNumber = Date | number | string

// Interfaces específicas para diferentes tipos de operaciones
export interface ComparisonOperators<T> {
  equals?: T | null
  not?: T | FilterCriteria<T> | null
  in?: T[]
  notIn?: T[]
}

export interface NumericOperators<T> {
  lt?: T
  lte?: T
  gt?: T
  gte?: T
}

export interface StringOperators<T> {
  contains?: T extends string ? string : never
  notContains?: T extends string ? string : never
  startsWith?: T extends string ? string : never
  notStartsWith?: T extends string ? string : never
  endsWith?: T extends string ? string : never
  notEndsWith?: T extends string ? string : never
  mode?: T extends string ? typeof CASE_INSENSITIVE_MODE : never
  regex?: T extends string
    ? string | { pattern: string; flags?: string }
    : never
}

export interface DateOperators<T> {
  before?: T extends DateOrNumber ? DateOrNumber : never
  after?: T extends DateOrNumber ? DateOrNumber : never
  between?: T extends DateOrNumber ? [DateOrNumber, DateOrNumber] : never
}

export interface ArrayOperators<T> {
  some?: T extends Array<infer U> ? FilterCriteria<U> : never
  none?: T extends Array<infer U> ? FilterCriteria<U> : never
  every?: T extends Array<infer U> ? FilterCriteria<U> : never
  has?: T extends Array<infer U> ? U : never
  hasEvery?: T extends Array<infer U> ? U[] : never
  hasSome?: T extends Array<infer U> ? U[] : never
  length?: T extends Array<any> ? number : never
}

export interface LogicalOperators<T> {
  AND?: FilterCriteria<T>[]
  OR?: FilterCriteria<T>[]
  NOT?: FilterCriteria<T>[]
}

export interface UtilityOperators {
  isNull?: boolean
  distinct?: boolean
}

// Interfaz principal que combina todas las operaciones específicas
export type FilterCriteria<T> = ComparisonOperators<T> &
  NumericOperators<T> &
  StringOperators<T> &
  DateOperators<T> &
  ArrayOperators<T> &
  LogicalOperators<T> &
  UtilityOperators &
  (T extends Array<any>
    ? unknown
    : T extends object
      ? { [P in keyof T]?: FilterCriteria<T[P]> }
      : unknown)

// Interfaces específicas para diferentes tipos de filtros
export interface ComparisonFilterCriteria<T> extends ComparisonOperators<T> {}

export interface NumericFilterCriteria<T> extends NumericOperators<T> {}

export interface StringFilterCriteria<T> extends StringOperators<T> {}

export interface DateFilterCriteria<T> extends DateOperators<T> {}

export interface ArrayFilterCriteria<T> extends ArrayOperators<T> {}

export interface LogicalFilterCriteria<T> extends LogicalOperators<T> {}

// Interfaces para operaciones específicas
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
  pagination: PaginationResult
}

export type FindUniqueResult<T> = T | null

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export type FilterQuery<T> = {
  where: FilterCriteria<T>
  pagination?: PaginationOptions
  orderBy?: { [P in keyof T]?: SortDirection }
  distinct?: boolean | string | string[]
}

// Interfaces separadas para diferentes tipos de operaciones
export interface FindManyOperations<T> {
  findMany: (query: FilterQuery<T>) => FindManyResult<T>
}

export interface FindUniqueOperations<T> {
  findUnique: (query: FilterQuery<T>) => FindUniqueResult<T>
}

// Interfaz principal que combina ambas operaciones
export interface FilterOperations<T>
  extends FindManyOperations<T>,
    FindUniqueOperations<T> {}
