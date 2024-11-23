import { describe, expect, it, vi } from 'vitest'
import { FilterKeys } from '../../filter.interface'
import { AndFilterGroup } from './and-filter-group'

// Mock para FilterEvaluator
vi.mock('../evaluate-filter', () => ({
  FilterEvaluator: vi.fn().mockImplementation(() => ({
    evaluate: vi.fn(),
  })),
}))

describe('AndFilterGroup', () => {
  it('debe manejar correctamente un grupo vacío de filtros', () => {
    const emptyFilterGroup = new AndFilterGroup([])

    expect(emptyFilterGroup.evaluate('value')).toBe(true)
  })

  it('debe manejar correctamente casos donde los filtros no están disponibles', () => {
    const emptyFilterGroup = new AndFilterGroup<FilterKeys<any>>([])
    const result = emptyFilterGroup.evaluate('value')

    expect(result).toBe(true)
  })
})
