import test, { describe } from 'node:test'
import { expect } from 'vitest'
import { evaluateFilter } from './evaluate-filter'
import { FilterKeys } from './filter.interface'

// describe('Filter Classes', () => {
//   test('EqualsFilter should return true for equal values', () => {
//     const filter = new EqualsFilter(5)
//     expect(filter.evaluate(5)).toBe(true)
//     expect(filter.evaluate(4)).toBe(false)
//   })

//   test('NotFilter should return true for non-equal values', () => {
//     const filter = new NotFilter(5)
//     expect(filter.evaluate(5)).toBe(false)
//     expect(filter.evaluate(4)).toBe(true)
//   })

//   test('InFilter should return true if value is in the list', () => {
//     const filter = new InFilter([1, 2, 3])
//     expect(filter.evaluate(2)).toBe(true)
//     expect(filter.evaluate(4)).toBe(false)
//   })

//   test('NotInFilter should return true if value is not in the list', () => {
//     const filter = new NotInFilter([1, 2, 3])
//     expect(filter.evaluate(4)).toBe(true)
//     expect(filter.evaluate(2)).toBe(false)
//   })

//   test('LtFilter should return true if value is less than the filter value', () => {
//     const filter = new LtFilter(10)
//     expect(filter.evaluate(9)).toBe(true)
//     expect(filter.evaluate(10)).toBe(false)
//   })

//   test('LteFilter should return true if value is less than or equal to the filter value', () => {
//     const filter = new LteFilter(10)
//     expect(filter.evaluate(10)).toBe(true)
//     expect(filter.evaluate(11)).toBe(false)
//   })

//   test('GtFilter should return true if value is greater than the filter value', () => {
//     const filter = new GtFilter(10)
//     expect(filter.evaluate(11)).toBe(true)
//     expect(filter.evaluate(10)).toBe(false)
//   })

//   test('GteFilter should return true if value is greater than or equal to the filter value', () => {
//     const filter = new GteFilter(10)
//     expect(filter.evaluate(10)).toBe(true)
//     expect(filter.evaluate(9)).toBe(false)
//   })

//   test('ContainsFilter should return true if value contains the filter value', () => {
//     const filter = new ContainsFilter('test')
//     expect(filter.evaluate('this is a test')).toBe(true)
//     expect(filter.evaluate('no match')).toBe(false)
//   })

//   test('StartsWithFilter should return true if value starts with the filter value', () => {
//     const filter = new StartsWithFilter('test')
//     expect(filter.evaluate('test case')).toBe(true)
//     expect(filter.evaluate('case test')).toBe(false)
//   })

//   test('EndsWithFilter should return true if value ends with the filter value', () => {
//     const filter = new EndsWithFilter('test')
//     expect(filter.evaluate('this is a test')).toBe(true)
//     expect(filter.evaluate('test case')).toBe(false)
//   })

//   test('BeforeFilter should return true if value is before the filter date', () => {
//     const filter = new BeforeFilter(new Date('2024-01-01'))
//     expect(filter.evaluate(new Date('2023-12-31'))).toBe(true)
//     expect(filter.evaluate(new Date('2024-01-01'))).toBe(false)
//   })

//   test('AfterFilter should return true if value is after the filter date', () => {
//     const filter = new AfterFilter(new Date('2024-01-01'))
//     expect(filter.evaluate(new Date('2024-01-02'))).toBe(true)
//     expect(filter.evaluate(new Date('2024-01-01'))).toBe(false)
//   })

//   test('BetweenFilter should return true if value is between the filter dates', () => {
//     const filter = new BetweenFilter([new Date('2023-12-01'), new Date('2024-01-01')])
//     expect(filter.evaluate(new Date('2023-12-15'))).toBe(true)
//     expect(filter.evaluate(new Date('2024-01-02'))).toBe(false)
//   })
// })

describe('FilterEvaluator Function', () => {
  test('evaluateFilter should return correct result', () => {
    const filterKeys: FilterKeys<number> = { equals: 5 }
    expect(evaluateFilter(filterKeys, 5)).toBe(false)
    // expect(evaluateFilter(filterKeys, 4)).toBe(false)
  })
})
