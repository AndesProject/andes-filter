import { describe, expect, it } from 'vitest'
import { ValidationUtils } from './validators'

describe('ValidationUtils', () => {
  it('validateArray', () => {
    expect(ValidationUtils.validateArray([1, 2, 3])).toBe(true)
    expect(ValidationUtils.validateArray('not-array')).toBe(false)
    expect(ValidationUtils.validateArray(null)).toBe(false)
    expect(ValidationUtils.validateArray(undefined)).toBe(false)
  })

  it('validateNonEmptyArray', () => {
    expect(ValidationUtils.validateNonEmptyArray([1])).toBe(true)
    expect(ValidationUtils.validateNonEmptyArray([])).toBe(false)
    expect(ValidationUtils.validateNonEmptyArray('not-array')).toBe(false)
  })

  it('validateString', () => {
    expect(ValidationUtils.validateString('abc')).toBe(true)
    expect(ValidationUtils.validateString(123)).toBe(false)
    expect(ValidationUtils.validateString(null)).toBe(false)
    expect(ValidationUtils.validateString(undefined)).toBe(false)
  })

  it('validateDate', () => {
    expect(ValidationUtils.validateDate(new Date())).toBe(true)
    expect(ValidationUtils.validateDate('2023-01-01')).toBe(true)
    expect(ValidationUtils.validateDate('invalid-date')).toBe(false)
    expect(ValidationUtils.validateDate(1234567890)).toBe(true)
    expect(ValidationUtils.validateDate(NaN)).toBe(false)
    expect(ValidationUtils.validateDate({})).toBe(false)
    expect(ValidationUtils.validateDate(undefined)).toBe(false)
  })

  it('validateObject', () => {
    expect(ValidationUtils.validateObject({})).toBe(true)
    expect(ValidationUtils.validateObject([])).toBe(false)
    expect(ValidationUtils.validateObject(null)).toBe(false)
    expect(ValidationUtils.validateObject('abc')).toBe(false)
  })

  it('validateNumber', () => {
    expect(ValidationUtils.validateNumber(123)).toBe(true)
    expect(ValidationUtils.validateNumber(NaN)).toBe(false)
    expect(ValidationUtils.validateNumber('123')).toBe(false)
  })

  it('validateNotNull', () => {
    expect(ValidationUtils.validateNotNull(0)).toBe(true)
    expect(ValidationUtils.validateNotNull('')).toBe(true)
    expect(ValidationUtils.validateNotNull(null)).toBe(false)
    expect(ValidationUtils.validateNotNull(undefined)).toBe(false)
  })

  it('isEmptyFilter', () => {
    expect(ValidationUtils.isEmptyFilter({})).toBe(true)
    expect(ValidationUtils.isEmptyFilter({ a: 1 })).toBe(false)
    expect(ValidationUtils.isEmptyFilter([])).toBe(false)
    expect(ValidationUtils.isEmptyFilter(null)).toBe(false)
    expect(ValidationUtils.isEmptyFilter('')).toBe(false)
  })

  it('hasOnlyPrimitiveValues', () => {
    expect(
      ValidationUtils.hasOnlyPrimitiveValues({ a: 1, b: 'x', c: true }),
    ).toBe(true)
    expect(ValidationUtils.hasOnlyPrimitiveValues({ a: 1, b: { x: 2 } })).toBe(
      false,
    )
    expect(
      ValidationUtils.hasOnlyPrimitiveValues({ a: null, b: undefined }),
    ).toBe(true)
    expect(ValidationUtils.hasOnlyPrimitiveValues(null)).toBe(false)
    expect(ValidationUtils.hasOnlyPrimitiveValues('string')).toBe(false)
    expect(ValidationUtils.hasOnlyPrimitiveValues({})).toBe(true)
  })
})
