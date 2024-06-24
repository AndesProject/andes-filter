import { describe, expect, it } from 'vitest'
import { helloWorld } from './index'

describe('Hello World', () => {
  it('should return a correct greeting', () => {
    expect(helloWorld('World')).toBe('Hello, World!!')
  })
})
