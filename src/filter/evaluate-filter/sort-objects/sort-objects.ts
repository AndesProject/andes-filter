import { QueryFilterOrderByEnum } from '../../filter.interface'

export function sortObjects<T>(
  items: T[],
  orderBy?: { [K in keyof T]?: QueryFilterOrderByEnum }
): T[] {
  if (!items || items.length === 0 || !orderBy) return items

  items.sort((a, b) => {
    for (const key in orderBy) {
      if (Object.prototype.hasOwnProperty.call(orderBy, key)) {
        const sortDirection = orderBy[key]
        const comparison = compare(a, b, key)

        if (comparison !== 0) {
          return sortDirection === QueryFilterOrderByEnum.DESC
            ? -comparison
            : comparison
        }
      }
    }
    return 0
  })

  return items
}

function compare<T>(a: T, b: T, key: keyof T): number {
  const valueA = a[key]
  const valueB = b[key]

  // Manejar null y undefined - colocarlos al final
  if (valueA === null && valueB === null) return 0
  if (valueA === null) return 1
  if (valueB === null) return -1
  if (valueA === undefined && valueB === undefined) return 0
  if (valueA === undefined) return 1
  if (valueB === undefined) return -1

  // Si ambos son números, comparar numéricamente
  if (typeof valueA === 'number' && typeof valueB === 'number') {
    return valueA - valueB
  }

  // Si ambos son strings, comparar alfabéticamente
  if (typeof valueA === 'string' && typeof valueB === 'string') {
    return valueA.localeCompare(valueB)
  }

  // Si ambos son booleanos, comparar como números
  if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
    return Number(valueA) - Number(valueB)
  }

  // Si ambos son fechas, comparar como fechas
  if (valueA instanceof Date && valueB instanceof Date) {
    return valueA.getTime() - valueB.getTime()
  }

  // Para tipos mixtos o diferentes, convertir a string y comparar
  const strA = String(valueA).toLowerCase()
  const strB = String(valueB).toLowerCase()

  if (strA < strB) return -1
  if (strA > strB) return 1
  return 0
}
