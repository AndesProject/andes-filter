import { FilterCriteria } from '../filter.interface'
import { EvaluateFilter } from './evaluate-filter.interface'
import { createFilterClassMap } from './evaluate-filter.map'

const SUPPORTED_OPERATORS = [
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

const ARRAY_OPERATION_KEYS = ['some', 'none', 'every']

export class FilterEvaluator<T> {
  private activeFilters: {
    fieldKey: string
    filterInstance: EvaluateFilter | FilterEvaluator<any>
  }[] = []
  private filterCriteria: FilterCriteria<T, keyof T>

  constructor(filterCriteria: FilterCriteria<T, keyof T>) {
    this.filterCriteria = filterCriteria
    this.initializeFilterInstances()
  }

  private initializeFilterInstances(): void {
    const isCaseInsensitiveMode = this.filterCriteria.mode === 'insensitive'

    Object.keys(this.filterCriteria).forEach((criteriaKey) => {
      if (criteriaKey === 'mode') return
      const criteriaValue =
        this.filterCriteria[criteriaKey as keyof FilterCriteria<T, keyof T>]

      if (SUPPORTED_OPERATORS.includes(criteriaKey)) {
        const filterInstance = createFilterClassMap<T>(
          criteriaKey as keyof FilterCriteria<T, keyof T>,
          criteriaValue,
          isCaseInsensitiveMode
        )
        if (filterInstance) {
          this.activeFilters.push({ fieldKey: criteriaKey, filterInstance })
        }
      } else if (ARRAY_OPERATION_KEYS.includes(criteriaKey)) {
        const filterInstance = createFilterClassMap<T>(
          criteriaKey as keyof FilterCriteria<T, keyof T>,
          criteriaValue,
          isCaseInsensitiveMode
        )
        if (filterInstance) {
          this.activeFilters.push({ fieldKey: criteriaKey, filterInstance })
        }
      } else if (typeof criteriaValue === 'object' && criteriaValue !== null) {
        if ('mode' in criteriaValue && criteriaValue.mode === 'insensitive') {
          Object.keys(criteriaValue).forEach((subCriteriaKey) => {
            if (subCriteriaKey === 'mode') return
            const subCriteriaValue = (criteriaValue as any)[subCriteriaKey]
            const filterInstance = createFilterClassMap(
              subCriteriaKey as keyof FilterCriteria<T, keyof T>,
              subCriteriaValue,
              true
            )
            if (filterInstance) {
              this.activeFilters.push({ fieldKey: criteriaKey, filterInstance })
            }
          })
        } else if (
          Object.keys(criteriaValue).length === 1 &&
          SUPPORTED_OPERATORS.includes(Object.keys(criteriaValue)[0])
        ) {
          const singleOperatorKey = Object.keys(criteriaValue)[0]
          const filterInstance = createFilterClassMap(
            singleOperatorKey as keyof FilterCriteria<T, keyof T>,
            (criteriaValue as any)[singleOperatorKey],
            isCaseInsensitiveMode
          )
          if (filterInstance) {
            this.activeFilters.push({ fieldKey: criteriaKey, filterInstance })
          }
        } else if (
          Object.keys(criteriaValue).length === 1 &&
          ARRAY_OPERATION_KEYS.includes(Object.keys(criteriaValue)[0])
        ) {
          const singleArrayOperationKey = Object.keys(criteriaValue)[0]
          const filterInstance = createFilterClassMap(
            singleArrayOperationKey as keyof FilterCriteria<T, keyof T>,
            (criteriaValue as any)[singleArrayOperationKey],
            isCaseInsensitiveMode
          )
          if (filterInstance) {
            this.activeFilters.push({ fieldKey: criteriaKey, filterInstance })
          }
        } else {
          this.activeFilters.push({
            fieldKey: criteriaKey,
            filterInstance: new FilterEvaluator(criteriaValue as any),
          })
        }
      } else {
        this.activeFilters.push({
          fieldKey: criteriaKey,
          filterInstance: new FilterEvaluator(criteriaValue as any),
        })
      }
    })
  }

  evaluate(targetData: any): boolean {
    if (this.activeFilters.length === 0) return true

    return this.activeFilters.every(({ fieldKey, filterInstance }) => {
      let dataToEvaluate = targetData

      if (
        targetData &&
        typeof targetData === 'object' &&
        !Array.isArray(targetData)
      ) {
        const isDirectOperatorField = SUPPORTED_OPERATORS.includes(fieldKey)
        if (isDirectOperatorField) {
          dataToEvaluate = targetData
        } else {
          dataToEvaluate = targetData[fieldKey]
        }
      }

      return filterInstance.evaluate(dataToEvaluate)
    })
  }
}
