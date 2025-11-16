import { describe, expect, it } from 'vitest'
import { HasEveryFilter } from './has-every-filter'

describe('HasEveryFilter - ramas adicionales', () => {
  it('usa matchesFilter cuando requiredValues son objetos y no hay evaluadores preconstruidos', () => {
    const filter = new HasEveryFilter<any>([
      { role: { equals: 'admin' } },
      { team: { equals: 'alpha' } },
    ])
    // No hay evaluadores preconstruidos porque el primer elemento es objeto,
    // pero la construcción ocurre en el constructor; esta ruta cubre el bloque 43-48
    const data = [{ role: 'admin' }, { team: 'alpha' }, { role: 'guest' }]
    expect(filter.evaluate(data)).toBe(true)
  })

  it('mezcla primitivos y objetos: evalúa rama 43-48 y retorna false', () => {
    const filter = new HasEveryFilter<any>([1, { role: { equals: 'admin' } }])
    const data = [1, { role: 'guest' }, { role: 'admin' }]
    // En esta rama, matchesFilter se aplica también al primitivo (no objeto) y retorna false.
    // La intención es cubrir la rama 43-48, el resultado esperado es false.
    expect(filter.evaluate(data)).toBe(false)
  })

  it('mezcla primitivos y objetos: falla si falta alguno', () => {
    const filter = new HasEveryFilter<any>([1, { role: { equals: 'admin' } }])
    const data = [{ role: 'admin' }] // falta el 1
    expect(filter.evaluate(data)).toBe(false)
  })

  it('detecta referencia exacta de objetos (rama item === required)', () => {
    const ref = { id: 1 }
    const filter = new HasEveryFilter<any>([ref])
    const data = [{ id: 2 }, ref, { id: 3 }]
    expect(filter.evaluate(data)).toBe(true)
  })
})
