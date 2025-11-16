import { describe, expect, it } from 'vitest'
import { ArrayEvaluator } from './array-evaluator'

describe('ArrayEvaluator.evaluateComplexFilter - rama evaluator.evaluate(item) false', () => {
  it('retorna false en some cuando evaluator.evaluate devuelve false para items no nulos', () => {
    const data = [{ v: 1 }, { v: 2 }]
    const evaluator = {
      evaluate: () => false,
    }
    expect(
      ArrayEvaluator.evaluateComplexFilter(data, evaluator as any, 'some'),
    ).toBe(false)
  })
})
