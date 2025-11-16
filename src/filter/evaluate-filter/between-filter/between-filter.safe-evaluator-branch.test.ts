import { describe, expect, it } from 'vitest'
import { BetweenFilter } from './between-filter'

describe('BetweenFilter - rama SafeEvaluator (tipos no contemplados)', () => {
  it('evalúa usando SafeEvaluator con BigInt', () => {
    const bf = new BetweenFilter([1n as any, 10n as any])
    expect(bf.evaluate(5n as any)).toBe(true)
    expect(bf.evaluate(11n as any)).toBe(false)
  })
})
