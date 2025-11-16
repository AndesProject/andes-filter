export function isNil(value: any): boolean {
  return value === null || value === undefined
}

export function isString(value: any): value is string {
  return typeof value === 'string'
}

export function isNumber(value: any): value is number {
  return typeof value === 'number'
}

export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean'
}

export function isObject(value: any): value is object {
  return typeof value === 'object' && value !== null
}

export function isValidDate(value: any): boolean {
  if (value instanceof Date) return true
  if (typeof value === 'number') return !isNaN(value) && value >= 0
  if (typeof value === 'string') {
    const parsedDate = new Date(value)

    return !isNaN(parsedDate.getTime())
  }

  return false
}

export function normalizeStringCase(
  inputString: string,
  caseInsensitive: boolean,
): string {
  return caseInsensitive ? inputString.toLowerCase() : inputString
}

export function compareStringsWithCase(
  firstString: string,
  secondString: string,
  caseInsensitive: boolean,
): boolean {
  const normalizedFirst = normalizeStringCase(firstString, caseInsensitive)

  const normalizedSecond = normalizeStringCase(secondString, caseInsensitive)

  return normalizedFirst === normalizedSecond
}

export function compareDateValues(
  firstDate: Date | string | number,
  secondDate: Date | string | number,
): boolean {
  return new Date(firstDate).getTime() === new Date(secondDate).getTime()
}

export function performStringOperation(
  operation: 'includes' | 'startsWith' | 'endsWith',
  sourceString: string,
  targetString: string,
  caseInsensitive: boolean,
  shouldNegate = false,
): boolean {
  if (!isString(sourceString) || !isString(targetString)) return shouldNegate
  const normalizedSource = normalizeStringCase(sourceString, caseInsensitive)

  const normalizedTarget = normalizeStringCase(targetString, caseInsensitive)

  const operationResult = normalizedSource[operation](normalizedTarget)

  return shouldNegate ? !operationResult : operationResult
}

export function isNonEmptyArray(arrayValue: any): arrayValue is any[] {
  return Array.isArray(arrayValue) && arrayValue.length > 0
}

export function allItemsMatch<T>(
  arrayItems: T[],
  condition: (item: T) => boolean,
): boolean {
  if (!Array.isArray(arrayItems)) return false

  return arrayItems.every(condition)
}

export function anyItemMatches<T>(
  arrayItems: T[],
  condition: (item: T) => boolean,
): boolean {
  if (!Array.isArray(arrayItems)) return false

  return arrayItems.some(condition)
}

export function noItemMatches<T>(
  arrayItems: T[],
  condition: (item: T) => boolean,
): boolean {
  if (!Array.isArray(arrayItems)) return false

  return !arrayItems.some(condition)
}

export const compareStrings = compareStringsWithCase
export const compareDates = compareDateValues
export const anyMatch = anyItemMatches
