export interface FilterKeys<T> {
  // Basic filters
  equals?: T
  not?: T
  in?: T[]
  notIn?: T[]
  lt?: T
  lte?: T
  gt?: T
  gte?: T

  // String filters
  contains?: string
  startsWith?: string
  endsWith?: string

  // Date and time filters
  before?: Date
  after?: Date
  between?: [Date, Date]

  // Object-related filters
  some?: FilterKeys<T>
  none?: FilterKeys<T>
  every?: FilterKeys<T>

  // Compound filters
  AND?: FilterKeys<T>[]
  OR?: FilterKeys<T>[]
  NOT?: FilterKeys<T>[]
}

export type FilterOptions<T> = {
  where: {
    [K in keyof T]?: FilterKeys<T>
  }
}
