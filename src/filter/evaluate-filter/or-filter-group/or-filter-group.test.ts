import { describe, expect, it, vi } from 'vitest'
import { FilterKeys } from '../../filter.interface'
import { OrFilterGroup } from './or-filter-group'

// Mock para FilterEvaluator
vi.mock('../evaluate-filter', () => ({
  FilterEvaluator: vi.fn().mockImplementation(() => ({
    evaluate: vi.fn(),
  })),
}))

describe('OrFilterGroup', () => {
  it('debe manejar correctamente un grupo vacío de filtros', () => {
    const emptyFilterGroup = new OrFilterGroup([])

    expect(emptyFilterGroup.evaluate('value')).toBe(false)
  })

  it('debe manejar correctamente casos donde los filtros no están disponibles', () => {
    const emptyFilterGroup = new OrFilterGroup<FilterKeys<any>>([])
    const result = emptyFilterGroup.evaluate('value')

    expect(result).toBe(false)
  })
})
