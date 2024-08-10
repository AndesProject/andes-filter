import { describe, expect, it, vi } from 'vitest'
import { FilterKeys } from '../../filter.interface'
import { FilterEvaluator } from '../evaluate-filter'
import { NotFilterGroup } from './not-filter-group'

// Mock para FilterEvaluator
vi.mock('../evaluate-filter', () => ({
  FilterEvaluator: vi.fn().mockImplementation(() => ({
    evaluate: vi.fn(),
  })),
}))

describe('NotFilterGroup', () => {
  const mockFilterKey1: FilterKeys<any> = {} // Configura un valor adecuado según tu implementación
  const mockFilterKey2: FilterKeys<any> = {} // Configura un valor adecuado según tu implementación
  const mockEvaluator1 = new FilterEvaluator(mockFilterKey1)
  const mockEvaluator2 = new FilterEvaluator(mockFilterKey2)
  const notFilterGroup = new NotFilterGroup([mockFilterKey1, mockFilterKey2])

  it('debe retornar true si todos los filtros en el grupo retornan false', () => {
    const mockEvaluate1 = vi.fn().mockImplementation(() => false)
    const mockEvaluate2 = vi.fn().mockImplementation(() => false)
    mockEvaluator1.evaluate = mockEvaluate1
    mockEvaluator2.evaluate = mockEvaluate2

    expect(notFilterGroup.evaluate('value')).toBe(true)
    expect(mockEvaluate1).toHaveBeenCalledWith('value')
    expect(mockEvaluate2).toHaveBeenCalledWith('value')
  })

  it('debe retornar false si al menos un filtro en el grupo retorna true', () => {
    const mockEvaluate1 = vi.fn().mockImplementation(() => true)
    const mockEvaluate2 = vi.fn().mockImplementation(() => false)
    mockEvaluator1.evaluate = mockEvaluate1
    mockEvaluator2.evaluate = mockEvaluate2

    expect(notFilterGroup.evaluate('value')).toBe(false)
    expect(mockEvaluate1).toHaveBeenCalledWith('value')
    expect(mockEvaluate2).toHaveBeenCalledWith('value')
  })

  it('debe manejar correctamente un grupo vacío de filtros', () => {
    const emptyFilterGroup = new NotFilterGroup<FilterKeys<any>>([])

    expect(emptyFilterGroup.evaluate('value')).toBe(true)
  })

  it('debe manejar correctamente un solo filtro en el grupo', () => {
    const singleFilterGroup = new NotFilterGroup([mockFilterKey1])
    const mockEvaluate = vi.fn().mockImplementation(() => true)
    mockEvaluator1.evaluate = mockEvaluate

    expect(singleFilterGroup.evaluate('value')).toBe(false)
    expect(mockEvaluate).toHaveBeenCalledWith('value')
  })

  it('debe manejar correctamente casos donde los filtros no están disponibles', () => {
    const emptyFilterGroup = new NotFilterGroup<FilterKeys<any>>([])
    const result = emptyFilterGroup.evaluate('value')

    expect(result).toBe(true)
  })
})
