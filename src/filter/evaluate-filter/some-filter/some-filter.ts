import { ArrayEvaluator as ArrayEvaluatorUtil } from '../../utils/array-evaluator'
import { ValidationUtils } from '../../utils/validators'
import { FilterEvaluator } from '../evaluate-filter'
import { EvaluateFilter } from '../evaluate-filter.interface'
import { createFilterClassMap, isKnownOperator } from '../evaluate-filter.map'

// Clase responsable solo de comparación profunda
class DeepComparator {
  public static compare(a: any, b: any): boolean {
    if (a === b) return true
    if (typeof a !== typeof b) return false
    if (
      !ValidationUtils.validateObject(a) ||
      !ValidationUtils.validateObject(b)
    )
      return false

    const aKeys = Object.keys(a)

    const bKeys = Object.keys(b)

    if (aKeys.length !== bKeys.length) return false

    for (const key of aKeys) {
      if (!bKeys.includes(key)) return false
      if (!DeepComparator.compare((a as any)[key], (b as any)[key]))
        return false
    }

    return true
  }
}

// Clase responsable solo de analizar la configuración del filtro
class FilterConfigurationAnalyzer {
  public static hasKnownOperator(obj: any): boolean {
    return (
      ValidationUtils.validateObject(obj) &&
      Object.keys(obj).some(
        (k) =>
          isKnownOperator(k) ||
          (ValidationUtils.validateObject((obj as any)[k]) &&
            FilterConfigurationAnalyzer.hasKnownOperator((obj as any)[k])),
      )
    )
  }

  public static analyzeConfiguration(filter: any): {
    isEmptyFilter: boolean
    isNegation: boolean
    evaluator: EvaluateFilter | FilterEvaluator<any> | null
  } {
    // Verificar si es un filtro vacío
    if (ValidationUtils.isEmptyFilter(filter)) {
      return { isEmptyFilter: true, isNegation: false, evaluator: null }
    }

    // Verificar si es un valor primitivo
    if (
      typeof filter !== 'object' ||
      filter === null ||
      Array.isArray(filter)
    ) {
      return {
        isEmptyFilter: false,
        isNegation: false,
        evaluator: {
          evaluate: (data: any) => data === filter,
        },
      }
    }

    const keys = Object.keys(filter)

    // Verificar si tiene operadores conocidos
    if (FilterConfigurationAnalyzer.hasKnownOperator(filter)) {
      return {
        isEmptyFilter: false,
        isNegation: false,
        evaluator: new FilterEvaluator(filter),
      }
    }

    // Analizar filtros con una sola clave
    if (keys.length === 1) {
      const key = keys[0]

      const value = (filter as Record<string, any>)[key]

      if (key === 'not') {
        return FilterConfigurationAnalyzer.createNegationEvaluator(value)
      }

      return { isEmptyFilter: false, isNegation: false, evaluator: null }
    }

    // Filtros con múltiples claves
    return { isEmptyFilter: false, isNegation: false, evaluator: null }
  }

  private static createNegationEvaluator(value: any): {
    isEmptyFilter: boolean
    isNegation: boolean
    evaluator: EvaluateFilter | FilterEvaluator<any> | null
  } {
    if (ValidationUtils.validateObject(value)) {
      const innerKeys = Object.keys(value)

      if (innerKeys.length === 1) {
        const innerKey = innerKeys[0]

        const innerValue = (value as Record<string, any>)[innerKey]

        return {
          isEmptyFilter: false,
          isNegation: true,
          evaluator: createFilterClassMap(String(innerKey), innerValue),
        }
      } else {
        return {
          isEmptyFilter: false,
          isNegation: true,
          evaluator: new FilterEvaluator(value),
        }
      }
    } else {
      return {
        isEmptyFilter: false,
        isNegation: true,
        evaluator: {
          evaluate: (data: any) => data === value,
        },
      }
    }
  }
}

export class SomeFilter implements EvaluateFilter {
  private evaluator: EvaluateFilter | FilterEvaluator<any> | null = null
  private isEmptyFilter: boolean = false
  private isNegation: boolean = false

  constructor(private filter: any) {
    const configuration =
      FilterConfigurationAnalyzer.analyzeConfiguration(filter)

    this.isEmptyFilter = configuration.isEmptyFilter
    this.isNegation = configuration.isNegation
    this.evaluator = configuration.evaluator
  }

  public evaluate(data: any): boolean {
    if (!ValidationUtils.validateArray(data)) return false
    if (data.length === 0) return false

    if (this.isEmptyFilter) {
      return data.some(
        (item: any) =>
          ValidationUtils.validateNotNull(item) &&
          ValidationUtils.validateObject(item),
      )
    }

    if (this.isNegation && this.evaluator) {
      return data.some(
        (item: any) =>
          ValidationUtils.validateNotNull(item) &&
          !this.evaluator!.evaluate(item),
      )
    }

    if (this.evaluator) {
      return ArrayEvaluatorUtil.evaluateComplexFilter(
        data,
        this.evaluator,
        'some',
      )
    }

    return data.some((item: any) => DeepComparator.compare(item, this.filter))
  }
}
