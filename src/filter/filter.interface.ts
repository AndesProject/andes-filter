export interface FilterKeys<T, K extends keyof T> {
  equals?: T[K] | null
  not?: T[K] | FilterKeys<T, K> | null
  in?: T[K][]
  notIn?: T[K][]
  lt?: T[K]
  lte?: T[K]
  gt?: T[K]
  gte?: T[K]

  // String filters (aplican solo si T[K] es string)
  contains?: T[K] extends string ? string : never
  startsWith?: T[K] extends string ? string : never
  endsWith?: T[K] extends string ? string : never
  mode?: T[K] extends string ? 'insensitive' : never

  // Date and time filters (aplican solo si T[K] es Date)
  before?: T[K] extends Date ? Date : never
  after?: T[K] extends Date ? Date : never
  between?: T[K] extends Date ? [Date, Date] : never

  // Object-related filters (aplican solo si T[K] es un objeto)
  some?: T[K] extends object ? FilterKeys<T[K], keyof T[K]> : never
  none?: T[K] extends object ? FilterKeys<T[K], keyof T[K]> : never
  every?: T[K] extends object ? FilterKeys<T[K], keyof T[K]> : never

  // List filters (aplican solo si T[K] es un array)
  has?: T[K] extends Array<infer U> ? U : never
  hasEvery?: T[K] extends Array<infer U> ? U[] : never
  hasSome?: T[K] extends Array<infer U> ? U[] : never
  length?: T[K] extends Array<any> ? number : never

  // Compound filters (combinaciones lógicas)
  AND?: FilterKeys<T, K>[]
  OR?: FilterKeys<T, K>[]
  NOT?: FilterKeys<T, K>[]
}

export type FilterOptions<T> = {
  where: {
    [K in keyof T]?: FilterKeys<T, K>
  }
}
