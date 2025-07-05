import { describe, expect, it, vi } from 'vitest'
import { ArrayEvaluator } from './array-evaluator'

const alwaysTrue = () => true

describe('ArrayEvaluator', () => {
  describe('evaluateArray', () => {
    it('returns false if not array', () => {
      expect(ArrayEvaluator.evaluateArray(null, alwaysTrue, 'some')).toBe(false)
      expect(
        ArrayEvaluator.evaluateArray('not-array', alwaysTrue, 'every')
      ).toBe(false)
    })
    it('handles some', () => {
      expect(
        ArrayEvaluator.evaluateArray([1, 2, 3], (n) => n === 2, 'some')
      ).toBe(true)
      expect(
        ArrayEvaluator.evaluateArray([1, 2, 3], (n) => n === 5, 'some')
      ).toBe(false)
      expect(
        ArrayEvaluator.evaluateArray([null, undefined], alwaysTrue, 'some')
      ).toBe(false)
    })
    it('handles every', () => {
      expect(
        ArrayEvaluator.evaluateArray([2, 4], (n) => n % 2 === 0, 'every')
      ).toBe(true)
      expect(
        ArrayEvaluator.evaluateArray([2, 3], (n) => n % 2 === 0, 'every')
      ).toBe(false)
      expect(ArrayEvaluator.evaluateArray([null, 2], alwaysTrue, 'every')).toBe(
        false
      )
    })
    it('handles none', () => {
      expect(
        ArrayEvaluator.evaluateArray([1, 2, 3], (n) => n === 5, 'none')
      ).toBe(true)
      expect(
        ArrayEvaluator.evaluateArray([1, 2, 3], (n) => n === 2, 'none')
      ).toBe(false)
      expect(
        ArrayEvaluator.evaluateArray([null, undefined], alwaysTrue, 'none')
      ).toBe(true)
    })
    it('handles default', () => {
      expect(
        ArrayEvaluator.evaluateArray([1, 2, 3], alwaysTrue, 'invalid' as any)
      ).toBe(false)
    })
  })

  describe('evaluateEmptyFilter', () => {
    it('returns false if not array', () => {
      expect(ArrayEvaluator.evaluateEmptyFilter(null, 'some')).toBe(false)
    })
    it('handles some', () => {
      expect(
        ArrayEvaluator.evaluateEmptyFilter([{}, null, undefined], 'some')
      ).toBe(true)
      expect(
        ArrayEvaluator.evaluateEmptyFilter([null, undefined], 'some')
      ).toBe(false)
    })
    it('handles every', () => {
      expect(ArrayEvaluator.evaluateEmptyFilter([1, 2, 3], 'every')).toBe(true)
    })
    it('handles none', () => {
      expect(ArrayEvaluator.evaluateEmptyFilter([1, 2, 3], 'none')).toBe(false)
    })
    it('handles default', () => {
      expect(
        ArrayEvaluator.evaluateEmptyFilter([1, 2, 3], 'invalid' as any)
      ).toBe(false)
    })
  })

  describe('evaluatePrimitiveFilter', () => {
    it('returns false if not array', () => {
      expect(ArrayEvaluator.evaluatePrimitiveFilter(null, 2, 'some')).toBe(
        false
      )
    })
    it('handles some', () => {
      expect(ArrayEvaluator.evaluatePrimitiveFilter([1, 2, 3], 2, 'some')).toBe(
        true
      )
      expect(ArrayEvaluator.evaluatePrimitiveFilter([1, 3, 4], 2, 'some')).toBe(
        false
      )
    })
    it('handles every', () => {
      expect(
        ArrayEvaluator.evaluatePrimitiveFilter([2, 2, 2], 2, 'every')
      ).toBe(true)
      expect(
        ArrayEvaluator.evaluatePrimitiveFilter([2, 3, 2], 2, 'every')
      ).toBe(false)
    })
    it('handles none', () => {
      expect(ArrayEvaluator.evaluatePrimitiveFilter([1, 3, 4], 2, 'none')).toBe(
        true
      )
      expect(ArrayEvaluator.evaluatePrimitiveFilter([1, 2, 3], 2, 'none')).toBe(
        false
      )
    })
  })

  describe('evaluateSimpleObjectFilter', () => {
    it('returns false if not array', () => {
      expect(
        ArrayEvaluator.evaluateSimpleObjectFilter(null, { a: 1 }, 'some')
      ).toBe(false)
    })
    it('handles some', () => {
      expect(
        ArrayEvaluator.evaluateSimpleObjectFilter(
          [{ a: 1 }, { a: 2 }],
          { a: 1 },
          'some'
        )
      ).toBe(true)
      expect(
        ArrayEvaluator.evaluateSimpleObjectFilter([{ a: 2 }], { a: 1 }, 'some')
      ).toBe(false)
      expect(
        ArrayEvaluator.evaluateSimpleObjectFilter(
          [null, undefined],
          { a: 1 },
          'some'
        )
      ).toBe(false)
    })
    it('handles every', () => {
      expect(
        ArrayEvaluator.evaluateSimpleObjectFilter(
          [{ a: 1 }, { a: 1 }],
          { a: 1 },
          'every'
        )
      ).toBe(true)
      expect(
        ArrayEvaluator.evaluateSimpleObjectFilter(
          [{ a: 1 }, { a: 2 }],
          { a: 1 },
          'every'
        )
      ).toBe(false)
    })
    it('handles none', () => {
      expect(
        ArrayEvaluator.evaluateSimpleObjectFilter(
          [{ a: 2 }, { a: 3 }],
          { a: 1 },
          'none'
        )
      ).toBe(true)
      expect(
        ArrayEvaluator.evaluateSimpleObjectFilter(
          [{ a: 1 }, { a: 2 }],
          { a: 1 },
          'none'
        )
      ).toBe(false)
    })
  })

  describe('evaluateComplexFilter', () => {
    it('returns false if not array', () => {
      const fakeEval = { evaluate: vi.fn() }
      expect(ArrayEvaluator.evaluateComplexFilter(null, fakeEval, 'some')).toBe(
        false
      )
    })
    it('handles some', () => {
      const fakeEval = { evaluate: (x: any) => x === 2 }
      expect(
        ArrayEvaluator.evaluateComplexFilter([1, 2, 3], fakeEval, 'some')
      ).toBe(true)
      expect(
        ArrayEvaluator.evaluateComplexFilter([1, 3, 4], fakeEval, 'some')
      ).toBe(false)
      expect(
        ArrayEvaluator.evaluateComplexFilter(
          [null, undefined],
          fakeEval,
          'some'
        )
      ).toBe(false)
    })
    it('handles every', () => {
      const fakeEval = { evaluate: (x: any) => typeof x === 'number' }
      expect(
        ArrayEvaluator.evaluateComplexFilter([1, 2, 3], fakeEval, 'every')
      ).toBe(true)
      expect(
        ArrayEvaluator.evaluateComplexFilter([1, 'a', 3], fakeEval, 'every')
      ).toBe(false)
    })
    it('handles none', () => {
      const fakeEval = { evaluate: (x: any) => x === 2 }
      expect(
        ArrayEvaluator.evaluateComplexFilter([1, 3, 4], fakeEval, 'none')
      ).toBe(true)
      expect(
        ArrayEvaluator.evaluateComplexFilter([1, 2, 3], fakeEval, 'none')
      ).toBe(false)
    })
  })

  describe('isDistinct', () => {
    it('returns false if not array', () => {
      expect(ArrayEvaluator.isDistinct(null)).toBe(false)
    })
    it('returns true if all values are unique', () => {
      expect(ArrayEvaluator.isDistinct([1, 2, 3])).toBe(true)
      expect(ArrayEvaluator.isDistinct(['a', 'b', 'c'])).toBe(true)
    })
    it('returns false if there are duplicates', () => {
      expect(ArrayEvaluator.isDistinct([1, 2, 2, 3])).toBe(false)
      expect(ArrayEvaluator.isDistinct(['a', 'b', 'a'])).toBe(false)
    })
  })
})
