import { describe, expect, it } from 'vitest'
import { FilterEvaluator } from '../evaluate-filter/evaluate-filter'
import { ArrayEvaluator } from './array-evaluator'

describe('ArrayEvaluator - guard branches', () => {
  it('evaluateSimpleObjectFilter retorna false cuando item no es objeto (cubre validateObject false)', () => {
    const data = [1, 'x', null]
    const filter = { a: 1 }
    expect(
      ArrayEvaluator.evaluateSimpleObjectFilter(data, filter, 'some'),
    ).toBe(false)
  })

  it('evaluateComplexFilter retorna false para items nulos (cubre validateNotNull false)', () => {
    const data = [null]
    const evaluator: FilterEvaluator<any> = {
      evaluate: () => true,
    } as any
    expect(ArrayEvaluator.evaluateComplexFilter(data, evaluator, 'every')).toBe(
      false,
    )
  })
})
