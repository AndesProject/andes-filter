export const TEST_NAMES = [
  'Alice',
  'Alice',
  'Bob',
  'Charlie',
  'David',
  'Eva',
  'Frank',
  'Grace',
  'Hannah',
  'Isaac',
  'Jasmine',
]

export const TEST_NUMBERS = [10, 11, 12, 12, 0.5]

export const TEST_BOOLEANS = [true, false, false]

export const TEST_MIXED_VALUES = [
  { value: null },
  { value: undefined },
  { value: 'hello' },
  { value: 123 },
]

export const TEST_EMPTY_STRINGS = [
  { value: '' },
  { value: 'hello' },
  { value: 'world' },
  { value: 'hello world' },
]

export const TEST_CASE_INSENSITIVE = [
  { name: 'Alice' },
  { name: 'BOB' },
  { name: 'Charlie' },
  { name: 'david' },
  { name: 'EVA' },
]

export const TEST_COMPLEX_NAMES = [...TEST_NAMES, 'Gustavo Cerati']

export function createTestFilter<T>(data: T[]) {
  return { testData: data }
}

export function expectEmptyResult(result: any) {
  expect(result.data.length).toBe(0)
}

export function expectSingleResult(result: any) {
  expect(result.data.length).toBe(1)
}

export function expectMultipleResults(result: any, count: number) {
  expect(result.data.length).toBe(count)
}
