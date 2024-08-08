import { FilterKeys } from './filter.interface'

interface Filter {
  evaluate(value: any): boolean
}

export class EqualsFilter<T> implements Filter {
  constructor(private filterValue: T) {}

  evaluate(value: any): boolean {
    return value === this.filterValue
  }
}

export class NotFilter<T> implements Filter {
  constructor(private filterValue: T) {}

  evaluate(value: any): boolean {
    return value !== this.filterValue
  }
}

export class InFilter<T> implements Filter {
  constructor(private filterValues: T[]) {}

  evaluate(value: any): boolean {
    return this.filterValues.includes(value)
  }
}

export class NotInFilter<T> implements Filter {
  constructor(private filterValues: T[]) {}

  evaluate(value: any): boolean {
    return !this.filterValues.includes(value)
  }
}

export class LtFilter<T> implements Filter {
  constructor(private filterValue: T) {}

  evaluate(value: any): boolean {
    return value < this.filterValue
  }
}

export class LteFilter<T> implements Filter {
  constructor(private filterValue: T) {}

  evaluate(value: any): boolean {
    return value <= this.filterValue
  }
}

export class GtFilter<T> implements Filter {
  constructor(private filterValue: T) {}

  evaluate(value: any): boolean {
    return value > this.filterValue
  }
}

export class GteFilter<T> implements Filter {
  constructor(private filterValue: T) {}

  evaluate(value: any): boolean {
    return value >= this.filterValue
  }
}

export class ContainsFilter implements Filter {
  constructor(private filterValue: string) {}

  evaluate(value: any): boolean {
    return typeof value === 'string' && value.includes(this.filterValue)
  }
}

export class StartsWithFilter implements Filter {
  constructor(private filterValue: string) {}

  evaluate(value: any): boolean {
    return typeof value === 'string' && value.startsWith(this.filterValue)
  }
}

export class EndsWithFilter implements Filter {
  constructor(private filterValue: string) {}

  evaluate(value: any): boolean {
    return typeof value === 'string' && value.endsWith(this.filterValue)
  }
}

export class BeforeFilter implements Filter {
  constructor(private filterValue: Date) {}

  evaluate(value: any): boolean {
    return value instanceof Date && value < this.filterValue
  }
}

export class AfterFilter implements Filter {
  constructor(private filterValue: Date) {}

  evaluate(value: any): boolean {
    return value instanceof Date && value > this.filterValue
  }
}

export class BetweenFilter implements Filter {
  constructor(private filterValues: [Date, Date]) {}

  evaluate(value: any): boolean {
    return value instanceof Date && value >= this.filterValues[0] && value <= this.filterValues[1]
  }
}

export class SomeFilter<T> implements Filter {
  constructor(private filterKey: FilterKeys<T>) {}

  evaluate(value: any): boolean {
    if (!Array.isArray(value)) return false
    const evaluator = new FilterEvaluator(this.filterKey)
    return value.some(v => evaluator.evaluate(v))
  }
}

export class NoneFilter<T> implements Filter {
  constructor(private filterKey: FilterKeys<T>) {}

  evaluate(value: any): boolean {
    if (!Array.isArray(value)) return false
    const evaluator = new FilterEvaluator(this.filterKey)
    return value.every(v => !evaluator.evaluate(v))
  }
}

export class EveryFilter<T> implements Filter {
  constructor(private filterKey: FilterKeys<T>) {}

  evaluate(value: any): boolean {
    if (!Array.isArray(value)) return false
    const evaluator = new FilterEvaluator(this.filterKey)
    return value.every(v => evaluator.evaluate(v))
  }
}

export class AndFilter<T> implements Filter {
  constructor(private filterKeys: FilterKeys<T>[]) {}

  evaluate(value: any): boolean {
    return this.filterKeys.every(f => new FilterEvaluator(f).evaluate(value))
  }
}

export class OrFilter<T> implements Filter {
  constructor(private filterKeys: FilterKeys<T>[]) {}

  evaluate(value: any): boolean {
    return this.filterKeys.some(f => new FilterEvaluator(f).evaluate(value))
  }
}

export class NotFilterGroup<T> implements Filter {
  constructor(private filterKeys: FilterKeys<T>[]) {}

  evaluate(value: any): boolean {
    return this.filterKeys.every(f => !new FilterEvaluator(f).evaluate(value))
  }
}

function createFilterMap<T>() {
  return {
    equals: EqualsFilter,
    not: NotFilter,
    in: InFilter,
    notIn: NotInFilter,
    lt: LtFilter,
    lte: LteFilter,
    gt: GtFilter,
    gte: GteFilter,
    contains: ContainsFilter,
    startsWith: StartsWithFilter,
    endsWith: EndsWithFilter,
    before: BeforeFilter,
    after: AfterFilter,
    between: BetweenFilter,
    some: SomeFilter,
    none: NoneFilter,
    every: EveryFilter,
    AND: AndFilter,
    OR: OrFilter,
    NOT: NotFilterGroup,
  } as { [key in keyof FilterKeys<T>]: any }
}

export class FilterEvaluator<T> {
  private filters: Filter[] = []

  constructor(private filterKeys: FilterKeys<T>) {
    this.initializeFilters()
  }

  private initializeFilters(): void {
    const filterMap = createFilterMap<T>()

    for (const key in this.filterKeys) {
      if (Object.hasOwn(this.filterKeys, key)) {
        const typedKey = key as keyof FilterKeys<T>
        const FilterClass = filterMap[typedKey]

        if (FilterClass) {
          this.filters.push(new FilterClass(this.filterKeys[typedKey]))
        }
      }
    }
  }

  evaluate(value: any): boolean {
    return this.filters.every(filter => filter.evaluate(value))
  }
}

export function evaluateFilter<T>(filterKeys: FilterKeys<T>, value: any): boolean {
  const evaluator = new FilterEvaluator(filterKeys)
  return evaluator.evaluate(value)
}
