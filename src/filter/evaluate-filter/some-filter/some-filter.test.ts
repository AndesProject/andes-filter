import { describe, expect, it } from 'vitest'
import { filterFrom } from '../../filter-from'

describe('SomeFilter', () => {
  it('string', () => {
    interface Post {
      title: string
    }

    interface User {
      name: string
      posts: Post[]
    }

    const filter = filterFrom<User>([
      { name: 'Alice', posts: [{ title: 'a' }] },
      { name: 'Alice', posts: [{ title: 'b' }] },
      { name: 'Bob', posts: [{ title: 'c' }] },
      { name: 'Charlie', posts: [{ title: 'd' }] },
      { name: 'David', posts: [{ title: 'e' }] },
      { name: 'Eva', posts: [{ title: 'f' }] },
      { name: 'Frank', posts: [{ title: 'global test' }] },
      { name: 'Grace', posts: [{ title: 'a' }] },
    ])

    expect(
      filter.findMany({
        where: {
          posts: {
            some: {
              title: {
                equals: 'a',
              },
            },
          },
        },
      }).length
    ).toBe(2)

    expect(
      filter.findMany({
        where: {
          posts: {
            some: {
              title: {
                contains: 'TEST',
                mode: 'insensitive',
              },
            },
          },
        },
      }).length
    ).toBe(1)
  })
})
