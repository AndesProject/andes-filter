import { describe, expect, it } from 'vitest'
import { FilterKeys } from '../../filter.interface'
import { ArrayEveryFilter } from './array-every-filter'

describe('ArrayEveryFilter', () => {
  it('should return false if the value is not an array', () => {
    const filter = new ArrayEveryFilter<{ name: string }>({ contains: '123' })
    expect(filter.evaluate('not an array')).toBe(false)
    expect(filter.evaluate('123')).toBe(false)
    expect(filter.evaluate({})).toBe(false)
    expect(filter.evaluate(null)).toBe(false)
    expect(filter.evaluate(undefined)).toBe(false)
  })

  it('should return true if all items in the array pass the filter evaluator', () => {
    const filter = new ArrayEveryFilter<FilterKeys<any>>({})
    expect(filter.evaluate([1, 2, 3])).toBe(true)
    expect(filter.evaluate(['a', 'b', 'c'])).toBe(true)
  })

  it('should handle empty arrays correctly', () => {
    const filter = new ArrayEveryFilter<FilterKeys<any>>({})
    expect(filter.evaluate([])).toBe(true)
  })
})
