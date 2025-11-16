import { AndFilterGroup } from './and-filter-group'
import { BeforeFilter } from './before-filter'
import { ContainsFilter } from './contains-filter'
import { EqualityFilter } from './equality-filter'
import {
  ArrayFilter,
  ComparisonFilter,
  DateFilter,
  LogicalFilter,
  NumericFilter,
  StringFilter,
} from './evaluate-filter.interface'
import { GreaterThanFilter } from './greater-than-filter'
import { SomeFilter } from './some-filter'

// Abstracción para el registro de filtros
export interface IFilterRegistry {
  getComparisonFilter(criteria: any): ComparisonFilter
  getStringFilter(criteria: any): StringFilter
  getNumericFilter(criteria: any): NumericFilter
  getDateFilter(criteria: any): DateFilter
  getArrayFilter(criteria: any): ArrayFilter
  getLogicalFilter(criteria: any): LogicalFilter
}

// Implementación por defecto del registro de filtros
export class DefaultFilterRegistry implements IFilterRegistry {
  getComparisonFilter(criteria: any): ComparisonFilter {
    if (criteria.equals !== undefined) {
      return new EqualityFilter(criteria.equals)
    }

    throw new Error('No valid comparison criteria provided')
  }
  getStringFilter(criteria: any): StringFilter {
    if (criteria.contains !== undefined) {
      return new ContainsFilter(
        criteria.contains,
        criteria.mode === 'insensitive',
      )
    }

    throw new Error('No valid string criteria provided')
  }
  getNumericFilter(criteria: any): NumericFilter {
    if (criteria.gt !== undefined) {
      return new GreaterThanFilter(criteria.gt)
    }

    throw new Error('No valid numeric criteria provided')
  }
  getDateFilter(criteria: any): DateFilter {
    if (criteria.before !== undefined) {
      return new BeforeFilter(criteria.before)
    }

    throw new Error('No valid date criteria provided')
  }
  getArrayFilter(criteria: any): ArrayFilter {
    if (criteria.some !== undefined) {
      return new SomeFilter(criteria.some)
    }

    throw new Error('No valid array criteria provided')
  }
  getLogicalFilter(criteria: any): LogicalFilter {
    if (criteria.AND !== undefined) {
      return new AndFilterGroup(criteria.AND)
    }

    throw new Error('No valid logical criteria provided')
  }
}

// FilterFactory ahora depende de la abstracción IFilterRegistry
export class FilterFactory {
  private registry: IFilterRegistry
  constructor(registry: IFilterRegistry = new DefaultFilterRegistry()) {
    this.registry = registry
  }
  static withRegistry(registry: IFilterRegistry) {
    return new FilterFactory(registry)
  }
  createComparisonFilter(criteria: any): ComparisonFilter {
    return this.registry.getComparisonFilter(criteria)
  }
  createStringFilter(criteria: any): StringFilter {
    return this.registry.getStringFilter(criteria)
  }
  createNumericFilter(criteria: any): NumericFilter {
    return this.registry.getNumericFilter(criteria)
  }
  createDateFilter(criteria: any): DateFilter {
    return this.registry.getDateFilter(criteria)
  }
  createArrayFilter(criteria: any): ArrayFilter {
    return this.registry.getArrayFilter(criteria)
  }
  createLogicalFilter(criteria: any): LogicalFilter {
    return this.registry.getLogicalFilter(criteria)
  }
}
