// Constantes centralizadas para operadores conocidos
export const KNOWN_OPERATORS = [
  'equals',
  'not',
  'in',
  'notIn',
  'lt',
  'lte',
  'gt',
  'gte',
  'contains',
  'notContains',
  'startsWith',
  'notStartsWith',
  'endsWith',
  'notEndsWith',
  'mode',
  'regex',
  'before',
  'after',
  'between',
  'has',
  'hasEvery',
  'hasSome',
  'length',
  'AND',
  'OR',
  'NOT',
  'isNull',
  'distinct',
  'some',
  'none',
  'every',
] as const

export type KnownOperator = (typeof KNOWN_OPERATORS)[number]

// Función helper para verificar si un string es un operador conocido
export function isKnownOperator(type: string): type is KnownOperator {
  return KNOWN_OPERATORS.includes(type as KnownOperator)
}
