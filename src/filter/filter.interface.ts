export const MODE_INSENSITIVE = 'insensitive' as const

export type DateOrNumber = Date | number | string

export interface QueryOption<T, K extends keyof T = keyof T> {
  equals?: T[K] | null
  not?: T[K] | QueryOption<T, K> | null
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
  mode?: T[K] extends string ? typeof MODE_INSENSITIVE : never
  regex?: T[K] extends string ? string : never

  before?: T[K] extends DateOrNumber ? DateOrNumber : never
  after?: T[K] extends DateOrNumber ? DateOrNumber : never
  between?: T[K] extends DateOrNumber ? [DateOrNumber, DateOrNumber] : never

  some?: T[K] extends object ? QueryOption<T[K], keyof T[K]> : never
  none?: T[K] extends object ? QueryOption<T[K], keyof T[K]> : never
  every?: T[K] extends object ? QueryOption<T[K], keyof T[K]> : never

  has?: T[K] extends Array<infer U> ? U : never
  hasEvery?: T[K] extends Array<infer U> ? U[] : never
  hasSome?: T[K] extends Array<infer U> ? U[] : never
  length?: T[K] extends Array<any> ? number : never

  AND?: QueryOption<T, K>[]
  OR?: QueryOption<T, K>[]
  NOT?: QueryOption<T, K>[]

  isNull?: boolean
  distinct?: boolean
}

export interface FindManyQueryResponse<T> {
  data: T[]
  pagination: {
    currentPage: number
    pageSize: number
    totalPages: number
    totalItems: number
  }
}

export type FindUniqueQueryResponse<T> = T | null

export type QueryFilter<T> = {
  where: {
    [K in keyof T]?: QueryOption<T, K>
  }
  pagination?: { page: number; limit: number }
  orderBy?: { [K in keyof T]?: 'asc' | 'desc' }
}

export interface FilterMethods<T> {
  findMany: (options: QueryFilter<T>) => FindManyQueryResponse<T>
  findUnique: (options: QueryFilter<T>) => FindUniqueQueryResponse<T>
}
