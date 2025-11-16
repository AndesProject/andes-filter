import { describe, expect, it } from 'vitest'
import { SomeFilter } from './some-filter'

describe('SomeFilter - rama de negación con item null', () => {
  it('ignora items nulos en negación y evalúa el resto', () => {
    const sf = new SomeFilter({ not: { equals: 1 } })
    // null se ignora (retorna false temprano), 2 cumple la negación (!equals 1) -> true
    expect(sf.evaluate([null, 2])).toBe(true)
  })
})
