import { describe, expect, it } from 'vitest'
import { NoneFilter } from '../evaluate-filter/none-filter/none-filter'
import { createFilterEngine } from '../filter-from'

describe('Debug NoneFilter', () => {
  it('should debug none filter behavior', () => {
    const testData = [
      { id: 1, tags: [{ name: 'foo' }, { name: 'bar' }] },
      { id: 2, tags: [{ name: 'baz' }] },
      { id: 3, tags: [] },
      { id: 4, tags: null },
      { id: 5, tags: undefined },
      { id: 6, tags: [{ name: 'qux' }, { name: 'foo' }] },
    ]

    // Test individual evaluation
    const noneFilter = new NoneFilter({ name: { equals: 'foo' } } as any)

    console.log('=== Individual evaluations ===')
    testData.forEach((item) => {
      const result = noneFilter.evaluate(item.tags)
      console.log(`ID ${item.id}: ${JSON.stringify(item.tags)} -> ${result}`)
    })

    // Test with filter
    const filter = createFilterEngine(testData)
    const result = filter.findMany({
      where: {
        tags: { none: { name: { equals: 'foo' } } as any },
      },
    })

    console.log('=== Filter result ===')
    console.log('Expected: [2, 3, 4, 5]')
    console.log(
      'Actual:',
      result.data.map((x) => x.id)
    )

    expect(result.data.map((x) => x.id)).toEqual([2, 3, 4, 5])
  })

  it('should debug empty filter with primitives', () => {
    const data = [
      { id: 1, values: [1, 2, 3] },
      { id: 2, values: [] },
      { id: 3, values: null },
    ]

    // Test individual evaluation
    const noneFilter = new NoneFilter({})

    console.log('=== Empty filter with primitives ===')
    data.forEach((item) => {
      const result = noneFilter.evaluate(item.values)
      console.log(`ID ${item.id}: ${JSON.stringify(item.values)} -> ${result}`)
    })

    const filter = createFilterEngine(data)
    const result = filter.findMany({
      where: {
        values: { none: {} as any },
      },
    })

    console.log('=== Filter result ===')
    console.log('Expected: [2, 3]')
    console.log(
      'Actual:',
      result.data.map((x) => x.id)
    )

    expect(result.data.map((x) => x.id).sort()).toEqual([2, 3])
  })
})
