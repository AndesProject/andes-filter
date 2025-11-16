import { describe, expect, it } from 'vitest'
import { BaseCompositeFilter } from './base-composite-filter'

class DummyComposite extends BaseCompositeFilter {
  public evaluate(): boolean {
    return true
  }
}

describe('BaseCompositeFilter - ramas getFilters con undefined', () => {
  it('getFilters retorna [] cuando filters es falsy', () => {
    const dummy = new DummyComposite(undefined as any)
    expect(dummy.getFilters()).toEqual([])
  })
})
