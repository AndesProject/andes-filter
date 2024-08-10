import { describe, expect, it } from 'vitest'
import { StringStartsWithFilter } from './string-starts-with-filter'

describe('StringStartsWithFilter', () => {
  it('debe retornar true cuando el valor es una cadena que comienza con el prefijo', () => {
    const filter = new StringStartsWithFilter('foo')
    expect(filter.evaluate('foobar')).toBe(true)
    expect(filter.evaluate('foo bar')).toBe(true)
  })

  it('debe retornar false cuando el valor es una cadena que no comienza con el prefijo', () => {
    const filter = new StringStartsWithFilter('foo')
    expect(filter.evaluate('barfoo')).toBe(false)
    expect(filter.evaluate('')).toBe(false)
  })

  it('debe retornar false cuando el valor no es una cadena', () => {
    const filter = new StringStartsWithFilter('foo')
    expect(filter.evaluate(123)).toBe(false)
    expect(filter.evaluate([])).toBe(false)
    expect(filter.evaluate({})).toBe(false)
    expect(filter.evaluate(null)).toBe(false)
    expect(filter.evaluate(undefined)).toBe(false)
  })

  it('debe manejar el prefijo vacío correctamente', () => {
    const filter = new StringStartsWithFilter('')
    expect(filter.evaluate('foo')).toBe(true) // Cualquier cadena comienza con una cadena vacía
    expect(filter.evaluate('')).toBe(true) // Una cadena vacía comienza con una cadena vacía
  })

  it('debe manejar valores con espacios en blanco correctamente', () => {
    const filter = new StringStartsWithFilter('foo')
    expect(filter.evaluate('foo bar')).toBe(true)
    expect(filter.evaluate('foo   bar')).toBe(true) // Espacios adicionales en la cadena
    expect(filter.evaluate(' bar foo')).toBe(false) // Espacios en el prefijo deben coincidir exactamente
  })
})
