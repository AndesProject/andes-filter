import { describe, expect, it } from 'vitest'
import { ArrayEvaluator } from './array-evaluator'

describe('ArrayEvaluator.evaluateComplexFilter - rama evaluator.evaluate(item)', () => {
  it('ejecuta evaluator.evaluate para items no nulos', () => {
    const data = [{ v: 1 }, { v: 2 }]
    const evaluator = {
      evaluate: (item: any) => item.v > 1,
    }
    // 'some' debe llegar a la llamada interna de evaluator.evaluate(item)
    expect(
      ArrayEvaluator.evaluateComplexFilter(data, evaluator as any, 'some'),
    ).toBe(true)
  })
})
