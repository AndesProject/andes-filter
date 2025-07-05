import { FilterCriteria } from '../filter.interface'
import { isObject } from '../utils/filter.helpers'
import { EvaluateFilter } from './evaluate-filter.interface'
import { createFilterClassMap } from './evaluate-filter.map'
import { InsensitiveModeFilter } from './insensitive-mode-filter'

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

// Clase responsable solo de inicializar filtros
class FilterInitializer {
  public static initializeFilters<T>(filterCriteria: FilterCriteria<T>): {
    fieldKey: string
    filterInstance: EvaluateFilter | FilterEvaluator<any>
  }[] {
    const activeFilters: {
      fieldKey: string
      filterInstance: EvaluateFilter | FilterEvaluator<any>
    }[] = []

    const isCaseInsensitiveMode = filterCriteria.mode === 'insensitive'

    Object.keys(filterCriteria).forEach((criteriaKey) => {
      if (criteriaKey === 'mode') return

      const criteriaValue =
        filterCriteria[criteriaKey as keyof FilterCriteria<T>]

      const filterInstance = FilterInitializer.createFilterInstance(
        criteriaKey,
        criteriaValue,
        isCaseInsensitiveMode
      )

      if (filterInstance) {
        activeFilters.push({ fieldKey: criteriaKey, filterInstance })
      }
    })

    return activeFilters
  }

  private static createFilterInstance(
    criteriaKey: string,
    criteriaValue: any,
    isCaseInsensitiveMode: boolean
  ): EvaluateFilter | FilterEvaluator<any> | null {
    if (SUPPORTED_OPERATORS.includes(criteriaKey)) {
      return createFilterClassMap(
        criteriaKey as any,
        criteriaValue,
        isCaseInsensitiveMode
      )
    }

    if (ARRAY_OPERATION_KEYS.includes(criteriaKey)) {
      return createFilterClassMap(
        criteriaKey as any,
        criteriaValue,
        isCaseInsensitiveMode
      )
    }

    if (isObject(criteriaValue)) {
      return FilterInitializer.handleObjectCriteria(
        criteriaKey,
        criteriaValue,
        isCaseInsensitiveMode
      )
    }

    return new FilterEvaluator(criteriaValue as any)
  }

  private static handleObjectCriteria(
    criteriaKey: string,
    criteriaValue: any,
    isCaseInsensitiveMode: boolean
  ): EvaluateFilter | FilterEvaluator<any> | null {
    if ('mode' in criteriaValue && criteriaValue.mode === 'insensitive') {
      return FilterInitializer.handleInsensitiveModeCriteria(
        criteriaKey,
        criteriaValue
      )
    }

    const keys = Object.keys(criteriaValue)

    if (keys.length === 1) {
      const singleKey = keys[0]
      if (SUPPORTED_OPERATORS.includes(singleKey)) {
        return createFilterClassMap(
          singleKey as any,
          criteriaValue[singleKey],
          isCaseInsensitiveMode
        )
      }

      if (ARRAY_OPERATION_KEYS.includes(singleKey)) {
        return createFilterClassMap(
          singleKey as any,
          criteriaValue[singleKey],
          isCaseInsensitiveMode
        )
      }
    }

    return new FilterEvaluator(criteriaValue as any)
  }

  private static handleInsensitiveModeCriteria(
    criteriaKey: string,
    criteriaValue: any
  ): EvaluateFilter | FilterEvaluator<any> | null {
    const filterInstances: EvaluateFilter[] = []

    Object.keys(criteriaValue).forEach((subCriteriaKey) => {
      if (subCriteriaKey === 'mode') return

      const subCriteriaValue = criteriaValue[subCriteriaKey]
      const filterInstance = createFilterClassMap(
        subCriteriaKey as any,
        subCriteriaValue,
        true
      )

      if (filterInstance) {
        filterInstances.push(filterInstance)
      }
    })

    // Crear un InsensitiveModeFilter que combine todos los filtros
    return filterInstances.length > 0
      ? new InsensitiveModeFilter(filterInstances)
      : null
  }
}

// Clase responsable solo de evaluar datos
class DataEvaluator {
  public static evaluateData(
    targetData: any,
    activeFilters: {
      fieldKey: string
      filterInstance: EvaluateFilter | FilterEvaluator<any>
    }[]
  ): boolean {
    if (activeFilters.length === 0) return true

    return activeFilters.every(({ fieldKey, filterInstance }) => {
      const dataToEvaluate = DataEvaluator.extractDataToEvaluate(
        targetData,
        fieldKey
      )
      return filterInstance.evaluate(dataToEvaluate)
    })
  }

  private static extractDataToEvaluate(targetData: any, fieldKey: string): any {
    if (!targetData || !isObject(targetData) || Array.isArray(targetData)) {
      return targetData
    }

    const isDirectOperatorField = SUPPORTED_OPERATORS.includes(fieldKey)
    if (isDirectOperatorField) {
      return targetData
    }

    return (targetData as Record<string, any>)[fieldKey]
  }
}

export class FilterEvaluator<T> {
  private activeFilters: {
    fieldKey: string
    filterInstance: EvaluateFilter | FilterEvaluator<any>
  }[] = []
  private filterCriteria: FilterCriteria<T>

  constructor(filterCriteria: FilterCriteria<T>) {
    this.filterCriteria = filterCriteria
    this.activeFilters = FilterInitializer.initializeFilters(filterCriteria)
  }

  public evaluate(targetData: any): boolean {
    return DataEvaluator.evaluateData(targetData, this.activeFilters)
  }
}
