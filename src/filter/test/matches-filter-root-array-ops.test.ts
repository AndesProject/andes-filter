import { describe, expect, it } from 'vitest'
import { matchesFilter } from '../evaluate-filter/matches-filter'
import type { FilterCriteria } from '../filter.interface'

describe('matchesFilter - array ops en raíz', () => {
  it('evalúa has en raíz contra un array', () => {
    const data = [1, 2, 3]
    const criteria: FilterCriteria<number[]> = { has: 3 } as any
    expect(matchesFilter(criteria as any, data)).toBe(true)
  })

  it('evalúa length en raíz contra un array', () => {
    const data = ['a', 'b', 'c']
    const criteria: FilterCriteria<string[]> = { length: { equals: 3 } } as any
    expect(matchesFilter(criteria as any, data)).toBe(true)
  })
})
