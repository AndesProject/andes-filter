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

  if (typeof valueA === 'number' && typeof valueB === 'number') {
    return valueA - valueB
  } else {
    const fa = `${valueA}`.trim().toLowerCase()
    const fb = `${valueB}`.trim().toLowerCase()
    if (fa < fb) return -1
    if (fa > fb) return 1
    return 0
  }
}
