import { describe, expect, it } from 'vitest'
import {
  allItemsMatch,
  anyItemMatches,
  anyMatch,
  compareDates,
  compareDateValues,
  compareStrings,
  compareStringsWithCase,
  isBoolean,
  isNil,
  isNonEmptyArray,
  isNumber,
  isObject,
  isString,
  isValidDate,
  noItemMatches,
  normalizeStringCase,
  performStringOperation,
} from './filter.helpers'

describe('filter.helpers', () => {
  it('isNil', () => {
    expect(isNil(null)).toBe(true)
    expect(isNil(undefined)).toBe(true)
    expect(isNil(0)).toBe(false)
    expect(isNil('')).toBe(false)
    expect(isNil(false)).toBe(false)
  })
  it('isString', () => {
    expect(isString('abc')).toBe(true)
    expect(isString(123)).toBe(false)
    expect(isString(null)).toBe(false)
  })
  it('isNumber', () => {
    expect(isNumber(123)).toBe(true)
    expect(isNumber(NaN)).toBe(true)
    expect(isNumber('123')).toBe(false)
  })
  it('isBoolean', () => {
    expect(isBoolean(true)).toBe(true)
    expect(isBoolean(false)).toBe(true)
    expect(isBoolean(0)).toBe(false)
  })
  it('isObject', () => {
    expect(isObject({})).toBe(true)
    expect(isObject([])).toBe(true)
    expect(isObject(null)).toBe(false)
    expect(isObject('abc')).toBe(false)
  })
  describe('isValidDate', () => {
    it('detecta instancias Date válidas', () => {
      expect(isValidDate(new Date())).toBe(true)
    })
    it('detecta números válidos', () => {
      expect(isValidDate(1234567890)).toBe(true)
      expect(isValidDate(0)).toBe(true)
      expect(isValidDate(-1)).toBe(false)
      expect(isValidDate(NaN)).toBe(false)
    })
    it('detecta strings válidos e inválidos', () => {
      expect(isValidDate('2023-01-01')).toBe(true)
      expect(isValidDate('invalid-date')).toBe(false)
      expect(isValidDate('')).toBe(false)
    })
    it('otros tipos', () => {
      expect(isValidDate({})).toBe(false)
      expect(isValidDate(undefined)).toBe(false)
      expect(isValidDate(null)).toBe(false)
    })
  })
  it('normalizeStringCase', () => {
    expect(normalizeStringCase('ABC', true)).toBe('abc')
    expect(normalizeStringCase('ABC', false)).toBe('ABC')
  })
  it('compareStringsWithCase', () => {
    expect(compareStringsWithCase('abc', 'ABC', true)).toBe(true)
    expect(compareStringsWithCase('abc', 'ABC', false)).toBe(false)
    expect(compareStringsWithCase('abc', 'abc', false)).toBe(true)
  })
  it('compareDateValues', () => {
    expect(compareDateValues('2023-01-01', new Date('2023-01-01'))).toBe(true)
    expect(compareDateValues(1672531200000, new Date(1672531200000))).toBe(true)
    expect(compareDateValues('2023-01-01', '2023-01-02')).toBe(false)
  })
  describe('performStringOperation', () => {
    it('includes', () => {
      expect(
        performStringOperation('includes', 'Hello World', 'world', true),
      ).toBe(true)
      expect(
        performStringOperation('includes', 'Hello World', 'WORLD', false),
      ).toBe(false)
      expect(
        performStringOperation('includes', 'Hello World', 'WORLD', true, true),
      ).toBe(false)
    })
    it('startsWith', () => {
      expect(performStringOperation('startsWith', 'Hello', 'he', true)).toBe(
        true,
      )
      expect(performStringOperation('startsWith', 'Hello', 'He', false)).toBe(
        true,
      )
      expect(performStringOperation('startsWith', 'Hello', 'lo', true)).toBe(
        false,
      )
      expect(
        performStringOperation('startsWith', 'Hello', 'he', true, true),
      ).toBe(false)
    })
    it('endsWith', () => {
      expect(performStringOperation('endsWith', 'Hello', 'LO', true)).toBe(true)
      expect(performStringOperation('endsWith', 'Hello', 'lo', false)).toBe(
        true,
      )
      expect(performStringOperation('endsWith', 'Hello', 'he', true)).toBe(
        false,
      )
      expect(
        performStringOperation('endsWith', 'Hello', 'LO', true, true),
      ).toBe(false)
    })
    it('tipos incorrectos', () => {
      expect(performStringOperation('includes', 123 as any, 'abc', true)).toBe(
        false,
      )
      expect(performStringOperation('includes', 'abc', 123 as any, true)).toBe(
        false,
      )
      expect(
        performStringOperation('includes', 123 as any, 456 as any, true),
      ).toBe(false)
      expect(
        performStringOperation('includes', 123 as any, 456 as any, true, true),
      ).toBe(true)
    })
  })
  it('isNonEmptyArray', () => {
    expect(isNonEmptyArray([1, 2, 3])).toBe(true)
    expect(isNonEmptyArray([])).toBe(false)
    expect(isNonEmptyArray('abc')).toBe(false)
  })
  it('allItemsMatch', () => {
    expect(allItemsMatch([2, 4, 6], (n) => n % 2 === 0)).toBe(true)
    expect(allItemsMatch([2, 3, 6], (n) => n % 2 === 0)).toBe(false)
    expect(allItemsMatch('not-an-array' as any, () => true)).toBe(false)
  })
  it('anyItemMatches', () => {
    expect(anyItemMatches([1, 2, 3], (n) => n === 2)).toBe(true)
    expect(anyItemMatches([1, 2, 3], (n) => n === 5)).toBe(false)
    expect(anyItemMatches('not-an-array' as any, () => true)).toBe(false)
  })
  it('noItemMatches', () => {
    expect(noItemMatches([1, 2, 3], (n) => n === 5)).toBe(true)
    expect(noItemMatches([1, 2, 3], (n) => n === 2)).toBe(false)
    expect(noItemMatches('not-an-array' as any, () => true)).toBe(false)
  })
  it('compareStrings alias', () => {
    expect(compareStrings('abc', 'ABC', true)).toBe(true)
  })
  it('compareDates alias', () => {
    expect(compareDates('2023-01-01', new Date('2023-01-01'))).toBe(true)
  })
  it('anyMatch alias', () => {
    expect(anyMatch([1, 2, 3], (n) => n === 2)).toBe(true)
  })
})
