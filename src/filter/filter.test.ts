import { describe, expect, it } from 'vitest'
import { filterFrom } from './filter'

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
