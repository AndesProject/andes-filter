import { describe, expect, it } from 'vitest'
import { NoneFilter } from './none-filter'

describe('NoneFilter - rama de negación con valores nulos', () => {
  it('considera true el elemento nulo en la rama de negación (cubre item == null)', () => {
    const nf = new NoneFilter({ not: { equals: 1 } })
    // Solo elemento null: el guard devuelve true y every(true) === true
    expect(nf.evaluate([null] as any)).toBe(true)
  })
})
