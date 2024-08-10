import { describe, expect, it, vi } from 'vitest'
import { FilterKeys } from '../../filter.interface'
import { FilterEvaluator } from '../evaluate-filter'
import { ArraySomeFilter } from './array-some-filter'

// Mock para FilterEvaluator
vi.mock('../evaluate-filter', () => ({
  FilterEvaluator: vi.fn().mockImplementation(() => ({
    evaluate: vi.fn(),
  })),
}))

describe('ArraySomeFilter', () => {
  const mockFilterKey: FilterKeys<any> = {} // Configura un valor adecuado según tu implementación
  const mockEvaluator = new FilterEvaluator(mockFilterKey)
  const arraySomeFilter = new ArraySomeFilter(mockFilterKey)

  it('debe retornar true si al menos un elemento en el array pasa el filtro', () => {
    const mockEvaluate = vi.fn().mockImplementation((value: any) => value === 'pass')
    mockEvaluator.evaluate = mockEvaluate

    const array = ['pass', 'fail']
    expect(arraySomeFilter.evaluate(array)).toBe(true)
    expect(mockEvaluate).toHaveBeenCalledTimes(1)
    expect(mockEvaluate).toHaveBeenCalledWith('pass')
  })

  it('debe retornar false si ningún elemento en el array pasa el filtro', () => {
    const mockEvaluate = vi.fn().mockImplementation(() => false)
    mockEvaluator.evaluate = mockEvaluate

    const array = ['fail', 'fail']
    expect(arraySomeFilter.evaluate(array)).toBe(false)
    expect(mockEvaluate).toHaveBeenCalledTimes(2)
    expect(mockEvaluate).toHaveBeenCalledWith('fail')
  })

  it('debe retornar false si el valor no es un array', () => {
    const mockEvaluate = vi.fn()
    mockEvaluator.evaluate = mockEvaluate

    expect(arraySomeFilter.evaluate('not an array')).toBe(false)
    expect(arraySomeFilter.evaluate(123)).toBe(false)
    expect(arraySomeFilter.evaluate({})).toBe(false)
    expect(arraySomeFilter.evaluate(null)).toBe(false)
    expect(arraySomeFilter.evaluate(undefined)).toBe(false)
    expect(mockEvaluate).not.toHaveBeenCalled()
  })

  it('debe manejar correctamente un array vacío', () => {
    const mockEvaluate = vi.fn()
    mockEvaluator.evaluate = mockEvaluate

    const array: any[] = []
    expect(arraySomeFilter.evaluate(array)).toBe(false)
    expect(mockEvaluate).not.toHaveBeenCalled()
  })

  it('debe retornar false si el filtro no encuentra elementos que pasar el filtro', () => {
    const mockEvaluate = vi.fn().mockImplementation(() => false)
    mockEvaluator.evaluate = mockEvaluate

    const array = ['fail', 'fail']
    expect(arraySomeFilter.evaluate(array)).toBe(false)
    expect(mockEvaluate).toHaveBeenCalledTimes(2)
    expect(mockEvaluate).toHaveBeenCalledWith('fail')
  })
})
