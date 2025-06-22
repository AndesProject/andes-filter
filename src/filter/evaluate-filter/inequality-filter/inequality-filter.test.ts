import { describe, expect, it } from 'vitest'
import { filterFrom } from '../../filter-from'

describe('InequalityFilter', () => {
  it('string', () => {
    const filter = filterFrom<{ name: string }>([
      { name: 'Alice' },
      { name: 'Alice' },
      { name: 'Bob' },
      { name: 'Charlie' },
      { name: 'David' },
      { name: 'Eva' },
      { name: 'Frank' },
      { name: 'Grace' },
      { name: 'Hannah' },
      { name: 'Isaac' },
      { name: 'Jasmine' },
    ])

    expect(
      filter.findMany({ where: { name: { not: 'Alice' } } }).data.length
    ).toBe(9)
    expect(
      filter.findMany({ where: { name: { not: 'Bob' } } }).data.length
    ).toBe(10)
    expect(
      filter.findMany({ where: { name: { not: 'Andrea' } } }).data.length
    ).toBe(11)
    expect(filter.findMany({ where: { name: { not: '' } } }).data.length).toBe(
      11
    )
    expect(
      filter.findMany({ where: { name: { not: null } } }).data.length
    ).toBe(11)
    expect(
      filter.findMany({ where: { name: { not: undefined } } }).data.length
    ).toBe(11)

    expect(
      filter.findUnique({ where: { name: { not: undefined } } })?.name
    ).toBe('Alice')
    expect(filter.findUnique({ where: { name: { not: 'Alice' } } })?.name).toBe(
      'Bob'
    )
    expect(
      filter.findUnique({ where: { name: { not: 'Jasmine' } } })?.name
    ).toBe('Alice')
    expect(filter.findUnique({ where: { name: { not: 'Isaac' } } })?.name).toBe(
      'Alice'
    )
  })
  it('number', () => {
    const filter = filterFrom<{ size: number }>([
      { size: 1 },
      { size: 2 },
      { size: 3 },
      { size: 4 },
      { size: 5 },
    ])

    expect(filter.findMany({ where: { size: { not: 1 } } }).data.length).toBe(4)
    expect(filter.findMany({ where: { size: { not: 2 } } }).data.length).toBe(4)
    expect(filter.findMany({ where: { size: { not: 3 } } }).data.length).toBe(4)
    expect(
      filter.findMany({ where: { size: { not: null } } }).data.length
    ).toBe(5)
    expect(
      filter.findMany({ where: { size: { not: undefined } } }).data.length
    ).toBe(5)

    expect(
      filter.findUnique({ where: { size: { not: undefined } } })?.size
    ).toBe(1)
    expect(filter.findUnique({ where: { size: { not: 1 } } })?.size).toBe(2)
    expect(filter.findUnique({ where: { size: { not: 2 } } })?.size).toBe(1)
    expect(filter.findUnique({ where: { size: { not: 3 } } })?.size).toBe(1)
  })
  it('boolean', () => {
    const filter = filterFrom<{ isValid: boolean }>([
      { isValid: true },
      { isValid: true },
      { isValid: false },
    ])

    expect(
      filter.findMany({ where: { isValid: { not: true } } }).data.length
    ).toBe(1)
    expect(
      filter.findMany({ where: { isValid: { not: false } } }).data.length
    ).toBe(2)
    expect(
      filter.findMany({ where: { isValid: { not: null } } }).data.length
    ).toBe(3)
    expect(
      filter.findMany({ where: { isValid: { not: undefined } } }).data.length
    ).toBe(3)

    expect(
      filter.findUnique({ where: { isValid: { not: undefined } } })?.isValid
    ).toBe(true)
    expect(
      filter.findUnique({ where: { isValid: { not: true } } })?.isValid
    ).toBe(false)
    expect(
      filter.findUnique({ where: { isValid: { not: false } } })?.isValid
    ).toBe(true)
  })

  it('not con objeto QueryOption (condición anidada)', () => {
    const filter = filterFrom<{ name: string }>([
      { name: 'Alice' },
      { name: 'Bob' },
      { name: 'Charlie' },
      { name: 'David' },
    ])
    // Negar el filtro: name contiene 'a' (case sensitive)
    expect(
      filter
        .findMany({ where: { name: { not: { contains: 'a' } } } })
        .data.map(x => x.name)
    ).toEqual(['Alice', 'Bob'])
    // Negar el filtro: name empieza con 'A'
    expect(
      filter
        .findMany({ where: { name: { not: { startsWith: 'A' } } } })
        .data.map(x => x.name)
    ).toEqual(['Bob', 'Charlie', 'David'])
    // Negar el filtro: name igual a 'Bob'
    expect(
      filter
        .findMany({ where: { name: { not: { equals: 'Bob' } } } })
        .data.map(x => x.name)
    ).toEqual(['Alice', 'Charlie', 'David'])
    // Negar el filtro: name termina con 'e'
    expect(
      filter
        .findMany({ where: { name: { not: { endsWith: 'e' } } } })
        .data.map(x => x.name)
    ).toEqual(['Bob', 'David'])
  })

  it('not anidado (doble negación)', () => {
    const filter = filterFrom<{ name: string }>([
      { name: 'Alice' },
      { name: 'Bob' },
      { name: 'Charlie' },
      { name: 'David' },
    ])
    // Doble negación: name igual a 'Bob'
    expect(
      filter
        .findMany({ where: { name: { not: { not: { equals: 'Bob' } } } } })
        .data.map(x => x.name)
    ).toEqual(['Bob'])
  })
})
