import { describe, expect, it } from 'vitest'
import { filterFrom } from './filter-from'

class User {
  name: string
}

describe('filterFrom', () => {
  it('should create an object with findMany and findUnique methods', () => {
    const filter = filterFrom<User>([])
    expect(typeof filter.findMany).toBe('function')
    expect(typeof filter.findUnique).toBe('function')
  })
})

describe('distinct en findMany', () => {
  it('distinct: true elimina duplicados de objetos completos', () => {
    const filter = filterFrom([
      { id: 1, name: 'a' },
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
      { id: 2, name: 'b' },
      { id: 3, name: 'c' },
    ])
    const result = filter.findMany({ where: {}, distinct: true })
    expect(result.data.length).toBe(3)
    expect(result.data).toEqual([
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
      { id: 3, name: 'c' },
    ])
  })

  it('distinct por campo string', () => {
    const filter = filterFrom([
      { id: 1, name: 'a' },
      { id: 2, name: 'a' },
      { id: 3, name: 'b' },
      { id: 4, name: 'b' },
      { id: 5, name: 'c' },
    ])
    const result = filter.findMany({ where: {}, distinct: 'name' })
    expect(result.data.length).toBe(3)
    expect(result.data.map(x => x.name).sort()).toEqual(['a', 'b', 'c'])
  })

  it('distinct por múltiples campos', () => {
    const filter = filterFrom([
      { id: 1, name: 'a', group: 1 },
      { id: 2, name: 'a', group: 2 },
      { id: 3, name: 'a', group: 1 },
      { id: 4, name: 'b', group: 1 },
      { id: 5, name: 'b', group: 2 },
    ])
    const result = filter.findMany({ where: {}, distinct: ['name', 'group'] })
    expect(result.data.length).toBe(4)
    expect(result.data).toEqual([
      { id: 1, name: 'a', group: 1 },
      { id: 2, name: 'a', group: 2 },
      { id: 4, name: 'b', group: 1 },
      { id: 5, name: 'b', group: 2 },
    ])
  })

  it('distinct funciona junto a otros filtros', () => {
    const filter = filterFrom([
      { id: 1, name: 'a', active: true },
      { id: 2, name: 'a', active: false },
      { id: 3, name: 'b', active: true },
      { id: 4, name: 'b', active: false },
      { id: 5, name: 'c', active: true },
    ])
    const result = filter.findMany({
      where: { active: { equals: true } },
      distinct: 'name',
    })
    expect(result.data.length).toBe(3)
    expect(result.data.map(x => x.name).sort()).toEqual(['a', 'b', 'c'])
  })

  it('distinct ignora null y undefined', () => {
    const filter = filterFrom([
      { id: 1, name: null },
      { id: 2, name: undefined },
      { id: 3, name: null },
      { id: 4, name: undefined },
      { id: 5, name: 'a' },
    ])
    const result = filter.findMany({ where: {}, distinct: 'name' })
    expect(result.data.length).toBe(3)
    expect(result.data.map(x => x.name)).toContain(null)
    expect(result.data.map(x => x.name)).toContain(undefined)
    expect(result.data.map(x => x.name)).toContain('a')
  })

  it('distinct con arrays y objetos anidados', () => {
    const filter = filterFrom([
      { id: 1, tags: [1, 2] },
      { id: 2, tags: [1, 2] },
      { id: 3, tags: [2, 3] },
      { id: 4, tags: [2, 3] },
      { id: 5, tags: [3, 4] },
    ])
    const result = filter.findMany({ where: {}, distinct: 'tags' })
    expect(result.data.length).toBe(3)
    expect(result.data.map(x => x.tags)).toEqual([
      [1, 2],
      [2, 3],
      [3, 4],
    ])
  })

  it('findUnique no aplica distinct, retorna el primer match', () => {
    const filter = filterFrom([
      { id: 1, name: 'a' },
      { id: 2, name: 'a' },
      { id: 3, name: 'b' },
    ])
    const result = filter.findUnique({
      where: { name: { equals: 'a' } },
      distinct: true,
    })
    expect(result).toEqual({ id: 1, name: 'a' })
  })
})
