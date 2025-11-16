import { describe, expect, it } from 'vitest'
import { paginateArray } from './paginate-array'

describe('paginateArray - validaciones y errores', () => {
  it('lanza error cuando page o size son menores a 1', () => {
    expect(() => paginateArray([1, 2, 3], { page: 0, size: 10 })).toThrow()
    expect(() => paginateArray([1, 2, 3], { page: 1, size: 0 })).toThrow()
  })
})
