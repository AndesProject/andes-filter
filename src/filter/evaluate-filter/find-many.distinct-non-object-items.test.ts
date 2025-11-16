import { describe, expect, it } from 'vitest'
import { findMany } from './find-many'

describe('findMany - distinct por campo con items no objeto', () => {
  it('no rompe cuando items no son objetos al calcular distinct por campo', () => {
    const data = ['a', 'a', 'b']
    const result = findMany<any>(
      {
        where: {},
        distinct: 'id',
      } as any,
      data as any,
    )
    // Se filtra por where {} -> coincide todo; distinct por 'id' en primitivos agrupa undefined
    // Resultado esperado: solo el primer elemento se mantiene
    expect(result.data).toEqual(['a'])
  })
})
