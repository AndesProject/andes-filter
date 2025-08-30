import { describe, expect, it } from 'vitest'
import { AfterFilter } from '../evaluate-filter/after-filter/after-filter'
import { GreaterThanFilter } from '../evaluate-filter/greater-than-filter/greater-than-filter'
import { createFilter } from '../filter-from'
describe('Debug After vs GT', () => {
  it('should debug invalid date handling', () => {
    const dataWithInvalid = [
      { id: 1, date: '2023-01-01' },
      { id: 2, date: 'invalid-date' },
      { id: 3, date: '2023-02-01' },
    ]
    const afterFilter = new AfterFilter('2023-01-15')
    const gtFilter = new GreaterThanFilter('2023-01-15')
    dataWithInvalid.forEach((item) => {
      const afterResult = afterFilter.evaluate(item.date)
      const gtResult = gtFilter.evaluate(item.date)
    })
    const filter = createFilter(dataWithInvalid)
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
    expect(afterResult.data).toEqual(gtResult.data)
  })
})
