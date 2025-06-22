import { QueryOption } from '../filter.interface'
import { EvaluateFilter } from './evaluate-filter.interface'
import { createFilterClassMap } from './evaluate-filter.map'

const OPERATORS = [
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
]

// Array operations that should be treated as field operations
const ARRAY_OPERATIONS = ['some', 'none', 'every']

export class FilterEvaluator<T> {
  private filters: {
    key: string
    filter: EvaluateFilter | FilterEvaluator<any>
  }[] = []
  private filterKeys: QueryOption<T, keyof T>

  constructor(filter: QueryOption<T, keyof T>) {
    this.filterKeys = filter
    this.initializeFilters()
  }

  private initializeFilters(): void {
    const hasInsensitiveMode = this.filterKeys.mode === 'insensitive'

    Object.keys(this.filterKeys).forEach((key) => {
      if (key === 'mode') return
      const value = this.filterKeys[key as keyof QueryOption<T, keyof T>]

      // Si es un operador directo (equals, length, etc.)
      if (OPERATORS.includes(key)) {
        const filter = createFilterClassMap<T>(
          key as keyof QueryOption<T, keyof T>,
          value,
          hasInsensitiveMode
        )
        if (filter) {
          this.filters.push({ key, filter })
        }
      }
      // Si es una operación de array (some, every, none)
      else if (ARRAY_OPERATIONS.includes(key)) {
        const filter = createFilterClassMap<T>(
          key as keyof QueryOption<T, keyof T>,
          value,
          hasInsensitiveMode
        )
        if (filter) {
          this.filters.push({ key, filter })
        }
      }
      // Si es un campo del objeto con subfiltros
      else if (typeof value === 'object' && value !== null) {
        // Verificar si es un filtro con modo insensible
        if ('mode' in value && value.mode === 'insensitive') {
          // Es un filtro con modo insensible, crear los filtros directamente
          Object.keys(value).forEach((subKey) => {
            if (subKey === 'mode') return
            const subValue = (value as any)[subKey]
            const filter = createFilterClassMap(
              subKey as keyof QueryOption<T, keyof T>,
              subValue,
              true // hasInsensitiveMode = true
            )
            if (filter) {
              this.filters.push({ key, filter })
            }
          })
        }
        // Verificar si el valor es un objeto con un solo operador
        else if (
          Object.keys(value).length === 1 &&
          OPERATORS.includes(Object.keys(value)[0])
        ) {
          const opKey = Object.keys(value)[0]
          const filter = createFilterClassMap(
            opKey as keyof QueryOption<T, keyof T>,
            (value as any)[opKey],
            hasInsensitiveMode
          )
          if (filter) {
            this.filters.push({ key, filter })
          }
        }
        // Verificar si el valor es un objeto con una sola operación de array
        else if (
          Object.keys(value).length === 1 &&
          ARRAY_OPERATIONS.includes(Object.keys(value)[0])
        ) {
          const arrayOpKey = Object.keys(value)[0]
          const filter = createFilterClassMap(
            arrayOpKey as keyof QueryOption<T, keyof T>,
            (value as any)[arrayOpKey],
            hasInsensitiveMode
          )
          if (filter) {
            this.filters.push({ key, filter })
          }
        } else {
          // Si el objeto tiene múltiples keys, crear un FilterEvaluator para el objeto completo
          // Esto permite combinar múltiples filtros en el mismo campo (ej: length + some)
          this.filters.push({
            key,
            filter: new FilterEvaluator(value as any),
          })
        }
      } else {
        // Para cualquier otro caso, tratar como subfiltro complejo
        this.filters.push({
          key,
          filter: new FilterEvaluator(value as any),
        })
      }
    })
  }

  evaluate(data: any): boolean {
    if (this.filters.length === 0) return true

    return this.filters.every(({ key, filter }) => {
      // If this FilterEvaluator is for a field (like 'projects'), extract the value for that key
      // and pass it as data to the sub-FilterEvaluator or filter
      let valueToEvaluate = data

      // Special case: if this FilterEvaluator is for a field with direct operators (like date: { after: ..., before: ... })
      // then pass the field value directly to each operator filter
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        // Check if this is a field with direct operators (like date, length, etc.)
        const isDirectOperator = OPERATORS.includes(key)
        if (isDirectOperator) {
          // For direct operators, use the field value as data
          valueToEvaluate = data
        } else {
          // For nested fields, extract the value for that key
          valueToEvaluate = data[key]
        }
      }

      return filter.evaluate(valueToEvaluate)
    })
  }
}
