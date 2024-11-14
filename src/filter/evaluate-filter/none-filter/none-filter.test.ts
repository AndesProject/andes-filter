import { describe, expect, it } from 'vitest'
import { FilterKeys } from '../../filter.interface'
import { NoneFilter } from './none-filter'

// Reemplazar FilterEvaluator globalmente con TestFilterEvaluator en cada prueba
describe('ArrayNoneFilter', () => {
  it('should return false if the value is not an array', () => {
    const filter = new NoneFilter<FilterKeys<number>>(5)
    expect(filter.evaluate('not an array')).toBe(false)
    expect(filter.evaluate(123)).toBe(false)
    expect(filter.evaluate({})).toBe(false)
    expect(filter.evaluate(null)).toBe(false)
    expect(filter.evaluate(undefined)).toBe(false)
  })

  it('should handle empty arrays correctly', () => {
    const filter = new NoneFilter<FilterKeys<number>>(5)
    expect(filter.evaluate([])).toBe(true) // Vacío, por lo tanto, true
  })
})
