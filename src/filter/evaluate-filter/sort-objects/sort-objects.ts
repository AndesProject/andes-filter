import { SortDirection } from '../../filter.interface'
import { isBoolean, isNumber, isString } from '../../utils/filter.helpers'
export function sortObjects<T>(
  items: T[],
  sortCriteria?: { [K in keyof T]?: SortDirection }
): T[] {
  if (!items || items.length === 0 || !sortCriteria) return items
  items.sort((firstItem, secondItem) => {
    for (const fieldKey in sortCriteria) {
      if (Object.prototype.hasOwnProperty.call(sortCriteria, fieldKey)) {
        const sortDirection = sortCriteria[fieldKey]
        const comparisonResult = compareValues(firstItem, secondItem, fieldKey)
        if (comparisonResult !== 0) {
          return sortDirection === SortDirection.DESC
            ? -comparisonResult
            : comparisonResult
        }
      }
    }
    return 0
  })
  return items
}

function compareValues<T>(
  firstItem: T,
  secondItem: T,
  fieldKey: keyof T
): number {
  const firstValue = firstItem[fieldKey]
  const secondValue = secondItem[fieldKey]
  if (firstValue === null && secondValue === null) return 0
  if (firstValue === null) return 1
  if (secondValue === null) return -1
  if (firstValue === undefined && secondValue === undefined) return 0
  if (firstValue === undefined) return 1
  if (secondValue === undefined) return -1
  if (isNumber(firstValue) && isNumber(secondValue)) {
    return firstValue - secondValue
  }
  if (isString(firstValue) && isString(secondValue)) {
    return firstValue.localeCompare(secondValue)
  }
  if (isBoolean(firstValue) && isBoolean(secondValue)) {
    return Number(firstValue) - Number(secondValue)
  }
  if (firstValue instanceof Date && secondValue instanceof Date) {
    return firstValue.getTime() - secondValue.getTime()
  }
  const firstStringValue = String(firstValue).toLowerCase()
  const secondStringValue = String(secondValue).toLowerCase()
  if (firstStringValue < secondStringValue) return -1
  if (firstStringValue > secondStringValue) return 1
  return 0
}
