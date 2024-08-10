import { describe, expect, it } from 'vitest'
import { StringEndsWithFilter } from './string-ends-with-filter' // Asegúrate de que la ruta sea correcta

describe('StringEndsWithFilter', () => {
  it('debe retornar true cuando el valor es una cadena que termina con el sufijo', () => {
    const filter = new StringEndsWithFilter('bar')
    expect(filter.evaluate('foobar')).toBe(true)
    expect(filter.evaluate('foo bar')).toBe(true)
  })

  it('debe retornar false cuando el valor es una cadena que no termina con el sufijo', () => {
    const filter = new StringEndsWithFilter('bar')
    expect(filter.evaluate('foo')).toBe(false)
    expect(filter.evaluate('')).toBe(false)
  })

  it('debe retornar false cuando el valor no es una cadena', () => {
    const filter = new StringEndsWithFilter('bar')
    expect(filter.evaluate(123)).toBe(false)
    expect(filter.evaluate([])).toBe(false)
    expect(filter.evaluate({})).toBe(false)
    expect(filter.evaluate(null)).toBe(false)
    expect(filter.evaluate(undefined)).toBe(false)
  })

  it('debe manejar el sufijo vacío correctamente', () => {
    const filter = new StringEndsWithFilter('')
    expect(filter.evaluate('foo')).toBe(true) // Cualquier cadena termina con una cadena vacía
    expect(filter.evaluate('')).toBe(true) // Una cadena vacía termina con una cadena vacía
  })

  it('debe manejar valores con espacios en blanco correctamente', () => {
    const filter = new StringEndsWithFilter('bar')
    expect(filter.evaluate('foo bar')).toBe(true)
    expect(filter.evaluate('foo   bar')).toBe(true) // Espacios adicionales en la cadena
    expect(filter.evaluate('bar foo')).toBe(false) // Espacios en el sufijo deben coincidir exactamente
  })
})
