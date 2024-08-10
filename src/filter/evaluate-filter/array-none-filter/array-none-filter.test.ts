import { describe, expect, it, vi } from 'vitest'
import { FilterKeys } from '../../filter.interface'
import { FilterEvaluator } from '../evaluate-filter'
import { ArrayNoneFilter } from './array-none-filter'

// Mock para FilterEvaluator
vi.mock('../evaluate-filter', () => ({
  FilterEvaluator: vi.fn().mockImplementation(() => ({
    evaluate: vi.fn(),
  })),
}))

describe('ArrayNoneFilter', () => {
  const mockFilterKey: FilterKeys<any> = {} // Configura un valor adecuado según tu implementación
  const mockEvaluator = new FilterEvaluator(mockFilterKey)
  const arrayNoneFilter = new ArrayNoneFilter(mockFilterKey)

  it('debe retornar true si ningún elemento en el array pasa el filtro', () => {
    const mockEvaluate = vi.fn().mockImplementation(() => false)
    mockEvaluator.evaluate = mockEvaluate

    const array = ['fail', 'fail']
    expect(arrayNoneFilter.evaluate(array)).toBe(true)
    expect(mockEvaluate).toHaveBeenCalledTimes(2)
    expect(mockEvaluate).toHaveBeenCalledWith('fail')
  })

  it('debe retornar false si al menos un elemento en el array pasa el filtro', () => {
    const mockEvaluate = vi.fn().mockImplementation((value: any) => value === 'pass')
    mockEvaluator.evaluate = mockEvaluate

    const array = ['pass', 'fail']
    expect(arrayNoneFilter.evaluate(array)).toBe(false)
    expect(mockEvaluate).toHaveBeenCalledTimes(1)
    expect(mockEvaluate).toHaveBeenCalledWith('pass')
  })

  it('debe retornar false si el valor no es un array', () => {
    const mockEvaluate = vi.fn()
    mockEvaluator.evaluate = mockEvaluate

    expect(arrayNoneFilter.evaluate('not an array')).toBe(false)
    expect(arrayNoneFilter.evaluate(123)).toBe(false)
    expect(arrayNoneFilter.evaluate({})).toBe(false)
    expect(arrayNoneFilter.evaluate(null)).toBe(false)
    expect(arrayNoneFilter.evaluate(undefined)).toBe(false)
    expect(mockEvaluate).not.toHaveBeenCalled()
  })

  it('debe manejar correctamente un array vacío', () => {
    const mockEvaluate = vi.fn()
    mockEvaluator.evaluate = mockEvaluate

    const array: any[] = []
    expect(arrayNoneFilter.evaluate(array)).toBe(true)
    expect(mockEvaluate).not.toHaveBeenCalled()
  })

  it('debe retornar true si todos los elementos en el array no pasan el filtro', () => {
    const mockEvaluate = vi.fn().mockImplementation(() => false)
    mockEvaluator.evaluate = mockEvaluate

    const array = ['fail', 'fail']
    expect(arrayNoneFilter.evaluate(array)).toBe(true)
    expect(mockEvaluate).toHaveBeenCalledTimes(2)
    expect(mockEvaluate).toHaveBeenCalledWith('fail')
  })
})
