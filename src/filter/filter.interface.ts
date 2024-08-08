export interface FilterKeys<T> {
  // Filtros básicos
  equals?: T
  not?: T
  in?: T[]
  notIn?: T[]
  lt?: T
  lte?: T
  gt?: T
  gte?: T

  // Filtros para cadenas de texto
  contains?: string
  startsWith?: string
  endsWith?: string

  // Filtros para fechas y tiempos
  before?: Date
  after?: Date
  between?: [Date, Date]

  // Filtros relacionados con objetos
  some?: FilterKeys<T>
  none?: FilterKeys<T>
  every?: FilterKeys<T>

  // Filtros compuestos
  AND?: FilterKeys<T>[]
  OR?: FilterKeys<T>[]
  NOT?: FilterKeys<T>[]
}

export type FilterOptions<T> = {
  where: {
    [K in keyof T]?: FilterKeys<T>
  }
}
