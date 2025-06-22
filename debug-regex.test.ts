import { InequalityFilter } from './src/filter/evaluate-filter/inequality-filter/inequality-filter'
import { RegexFilter } from './src/filter/evaluate-filter/regex-filter/regex-filter'

console.log('=== Debug Regex Filter ===')
const regexFilter = new RegexFilter({ pattern: 'test', flags: 'i' })
console.log('TEST matches:', regexFilter.evaluate('TEST'))
console.log('other matches:', regexFilter.evaluate('other'))

console.log('=== Debug Inequality Filter ===')
const inequalityFilter = new InequalityFilter({
  regex: { pattern: 'test', flags: 'i' },
})
console.log('TEST inequality:', inequalityFilter.evaluate('TEST'))
console.log('other inequality:', inequalityFilter.evaluate('other'))
