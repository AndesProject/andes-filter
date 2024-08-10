import { describe, expect, it } from 'vitest'
import { StringContainsFilter } from './string-contains-filter' // Asegúrate de que la ruta sea correcta

describe('StringContainsFilter', () => {
  it('debe retornar true cuando el valor es una cadena que contiene la subcadena', () => {
    const filter = new StringContainsFilter('foo')
    expect(filter.evaluate('foobar')).toBe(true)
    expect(filter.evaluate('foo bar')).toBe(true)
  })

  it('debe retornar false cuando el valor es una cadena que no contiene la subcadena', () => {
    const filter = new StringContainsFilter('foo')
    expect(filter.evaluate('bar')).toBe(false)
    expect(filter.evaluate('')).toBe(false)
  })

  it('debe retornar false cuando el valor no es una cadena', () => {
    const filter = new StringContainsFilter('foo')
    expect(filter.evaluate(123)).toBe(false)
    expect(filter.evaluate([])).toBe(false)
    expect(filter.evaluate({})).toBe(false)
    expect(filter.evaluate(null)).toBe(false)
    expect(filter.evaluate(undefined)).toBe(false)
  })

  it('debe manejar la subcadena vacía correctamente', () => {
    const filter = new StringContainsFilter('')
    expect(filter.evaluate('foo')).toBe(true) // Cualquier cadena contiene una subcadena vacía
    expect(filter.evaluate('')).toBe(true) // Una cadena vacía contiene una subcadena vacía
  })

  it('debe manejar valores con espacios en blanco correctamente', () => {
    const filter = new StringContainsFilter('foo bar')
    expect(filter.evaluate('foo bar baz')).toBe(true)
    expect(filter.evaluate('foo   bar')).toBe(true) // Espacios adicionales en la cadena
    expect(filter.evaluate('foo')).toBe(false) // Espacios en la subcadena deben coincidir exactamente
  })
})
