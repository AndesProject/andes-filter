import { describe, expect, it, vi } from 'vitest'
import { FilterKeys } from '../../filter.interface'
import { FilterEvaluator } from '../evaluate-filter'
import { ArrayEveryFilter } from './array-every-filter'

// Mock para FilterEvaluator
vi.mock('../evaluate-filter', () => ({
  FilterEvaluator: vi.fn().mockImplementation(() => ({
    evaluate: vi.fn(),
  })),
}))

describe('ArrayEveryFilter', () => {
  const mockFilterKey: FilterKeys<any> = {} // Configura un valor adecuado según tu implementación
  const mockEvaluator = new FilterEvaluator(mockFilterKey)
  const arrayEveryFilter = new ArrayEveryFilter(mockFilterKey)

  it('debe retornar true si todos los elementos en el array pasan el filtro', () => {
    const mockEvaluate = vi.fn().mockImplementation(() => true)
    mockEvaluator.evaluate = mockEvaluate

    const array = ['pass', 'pass']
    expect(arrayEveryFilter.evaluate(array)).toBe(true)
    expect(mockEvaluate).toHaveBeenCalledTimes(2)
    expect(mockEvaluate).toHaveBeenCalledWith('pass')
  })

  it('debe retornar false si al menos un elemento en el array no pasa el filtro', () => {
    const mockEvaluate = vi.fn().mockImplementation((value: any) => value === 'pass')
    mockEvaluator.evaluate = mockEvaluate

    const array = ['pass', 'fail']
    expect(arrayEveryFilter.evaluate(array)).toBe(false)
    expect(mockEvaluate).toHaveBeenCalledTimes(2)
    expect(mockEvaluate).toHaveBeenCalledWith('pass')
    expect(mockEvaluate).toHaveBeenCalledWith('fail')
  })

  it('debe retornar false si el valor no es un array', () => {
    const mockEvaluate = vi.fn()
    mockEvaluator.evaluate = mockEvaluate

    expect(arrayEveryFilter.evaluate('not an array')).toBe(false)
    expect(arrayEveryFilter.evaluate(123)).toBe(false)
    expect(arrayEveryFilter.evaluate({})).toBe(false)
    expect(arrayEveryFilter.evaluate(null)).toBe(false)
    expect(arrayEveryFilter.evaluate(undefined)).toBe(false)
    expect(mockEvaluate).not.toHaveBeenCalled()
  })

  it('debe manejar correctamente un array vacío', () => {
    const mockEvaluate = vi.fn()
    mockEvaluator.evaluate = mockEvaluate

    const array: any[] = []
    expect(arrayEveryFilter.evaluate(array)).toBe(true)
    expect(mockEvaluate).not.toHaveBeenCalled()
  })

  it('debe retornar false si el filtro no encuentra elementos que pasan el filtro', () => {
    const mockEvaluate = vi.fn().mockImplementation(() => false)
    mockEvaluator.evaluate = mockEvaluate

    const array = ['fail', 'fail']
    expect(arrayEveryFilter.evaluate(array)).toBe(false)
    expect(mockEvaluate).toHaveBeenCalledTimes(2)
    expect(mockEvaluate).toHaveBeenCalledWith('fail')
  })
})
