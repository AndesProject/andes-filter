import { describe, it } from 'vitest'
import { InequalityFilter } from '../evaluate-filter/inequality-filter/inequality-filter'
import { RegexFilter } from '../evaluate-filter/regex-filter/regex-filter'
describe('Debug Regex', () => {
  it('should debug regex filter', () => {
    const regexFilter = new RegexFilter({ pattern: 'test', flags: 'i' })
    const inequalityFilter = new InequalityFilter({
      regex: { pattern: 'test', flags: 'i' },
    })
  })
})
