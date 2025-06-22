import { describe, expect, it } from 'vitest'
import { AfterFilter } from '../evaluate-filter/after-filter/after-filter'
import { GreaterThanFilter } from '../evaluate-filter/greater-than-filter/greater-than-filter'
import { filterFrom } from '../filter-from'

describe('Debug After vs GT', () => {
  it('should debug invalid date handling', () => {
    const dataWithInvalid = [
      { id: 1, date: '2023-01-01' },
      { id: 2, date: 'invalid-date' },
      { id: 3, date: '2023-02-01' },
    ]

    console.log('=== Debug After vs GT ===')

    // Test individual evaluations
    const afterFilter = new AfterFilter('2023-01-15')
    const gtFilter = new GreaterThanFilter('2023-01-15')

    dataWithInvalid.forEach((item) => {
      const afterResult = afterFilter.evaluate(item.date)
      const gtResult = gtFilter.evaluate(item.date)
      console.log(`ID ${item.id}: after=${afterResult}, gt=${gtResult}`)
    })

    // Test full filter results
    const filter = filterFrom(dataWithInvalid)

    const afterResult = filter.findMany({
      where: {
        date: { after: '2023-01-15' },
      },
    })

    const gtResult = filter.findMany({
      where: {
        date: { gt: '2023-01-15' },
      },
    })

    console.log(
      'After result:',
      afterResult.data.map((d) => d.id)
    )
    console.log(
      'GT result:',
      gtResult.data.map((d) => d.id)
    )

    expect(afterResult.data).toEqual(gtResult.data)
  })
})
