import type { FilterQuery } from '../filter/filter.interface'
import {
  queryFilterToUrlParams,
  urlParamsToQueryFilter,
} from '../utils/filter.parser'

export interface UrlFilterServiceOptions {
  paramKey?: string
  getUrl: () => string
  setUrl: (url: string) => void
}

export interface UrlFilterService<T> {
  getFilter: () => FilterQuery<T>
  setFilter: (query: FilterQuery<T>) => void
  updateFilter: (updater: (prev: FilterQuery<T>) => FilterQuery<T>) => void
  clearFilter: () => void
  syncFromUrl: () => void
  subscribe: (listener: (query: FilterQuery<T>) => void) => () => void
}

const DEFAULT_FILTER: FilterQuery<unknown> = { where: {} }

export const createUrlFilterService = <T>(
  options: UrlFilterServiceOptions,
): UrlFilterService<T> => {
  const paramKey = options.paramKey ?? 'filter'

  let currentFilter: FilterQuery<T> = DEFAULT_FILTER as FilterQuery<T>

  const listeners = new Set<(query: FilterQuery<T>) => void>()

  const notify = () => {
    listeners.forEach((listener) => listener(currentFilter))
  }

  const readFilterFromUrl = (): FilterQuery<T> => {
    const url = new URL(options.getUrl())

    const encoded = url.searchParams.get(paramKey)

    if (!encoded) {
      return { where: {} } as FilterQuery<T>
    }

    return urlParamsToQueryFilter<T>(encoded)
  }

  const writeFilterToUrl = (query: FilterQuery<T>) => {
    const url = new URL(options.getUrl())

    const encoded = queryFilterToUrlParams(query)

    url.searchParams.set(paramKey, encoded)

    options.setUrl(url.toString())
  }

  const removeFilterFromUrl = () => {
    const url = new URL(options.getUrl())

    url.searchParams.delete(paramKey)

    options.setUrl(url.toString())
  }

  currentFilter = readFilterFromUrl()

  return {
    getFilter: () => currentFilter,
    setFilter: (query: FilterQuery<T>) => {
      currentFilter = query
      writeFilterToUrl(query)
      notify()
    },
    updateFilter: (updater) => {
      const next = updater(currentFilter)

      currentFilter = next
      writeFilterToUrl(next)
      notify()
    },
    clearFilter: () => {
      currentFilter = { where: {} } as FilterQuery<T>
      removeFilterFromUrl()
      notify()
    },
    syncFromUrl: () => {
      currentFilter = readFilterFromUrl()
      notify()
    },
    subscribe: (listener) => {
      listeners.add(listener)

      return () => {
        listeners.delete(listener)
      }
    },
  }
}
