import { describe, expect, it, vi } from 'vitest'
import type { FilterQuery } from '../filter/filter.interface'
import { createUrlFilterService } from '../url-filter/url-filter.service'
import {
  queryFilterToUrlParams,
  urlParamsToQueryFilter,
} from '../utils/filter.parser'

interface TestUser {
  name: string
  age: number
}

const createEncodedFilterParam = <T>(filter: FilterQuery<T>): string => {
  return queryFilterToUrlParams(filter)
}

describe('url-filter.service', () => {
  it('debe inicializarse con el filtro vacío cuando no hay parámetro en la URL', () => {
    let currentUrl = 'https://example.com/path'

    const service = createUrlFilterService<TestUser>({
      getUrl: () => currentUrl,
      setUrl: (url) => {
        currentUrl = url
      },
    })

    const filter = service.getFilter()

    expect(filter).toEqual({ where: {} })
  })

  it('debe inicializar el estado desde el parámetro de la URL si existe', () => {
    const originalFilter: FilterQuery<TestUser> = {
      where: {
        name: { equals: 'John' },
        age: { gte: 25 },
      },
    }

    const encoded = createEncodedFilterParam(originalFilter)

    let currentUrl = `https://example.com/path?filter=${encodeURIComponent(encoded)}`

    const service = createUrlFilterService<TestUser>({
      getUrl: () => currentUrl,
      setUrl: (url) => {
        currentUrl = url
      },
    })

    const filter = service.getFilter()

    expect(filter).toEqual(originalFilter)
  })

  it('debe actualizar la URL y el estado cuando se establece un nuevo filtro', () => {
    let currentUrl = 'https://example.com/path'

    const service = createUrlFilterService<TestUser>({
      getUrl: () => currentUrl,
      setUrl: (url) => {
        currentUrl = url
      },
    })

    const newFilter: FilterQuery<TestUser> = {
      where: {
        name: { contains: 'Alice', mode: 'insensitive' },
      },
    }

    service.setFilter(newFilter)

    const url = new URL(currentUrl)
    const encodedParam = url.searchParams.get('filter')

    expect(encodedParam).not.toBeNull()

    const decoded = urlParamsToQueryFilter<TestUser>(encodedParam || '')

    expect(decoded).toEqual(newFilter)
    expect(service.getFilter()).toEqual(newFilter)
  })

  it('debe permitir actualizar el filtro de forma reactiva con updateFilter', () => {
    let currentUrl = 'https://example.com/path'

    const service = createUrlFilterService<TestUser>({
      getUrl: () => currentUrl,
      setUrl: (url) => {
        currentUrl = url
      },
    })

    service.setFilter({
      where: {
        name: { equals: 'John' },
      },
    })

    service.updateFilter((prev) => ({
      where: {
        ...prev.where,
        age: { gte: 30 },
      },
    }))

    const currentFilter = service.getFilter()

    expect(currentFilter.where.name).toEqual({ equals: 'John' })
    expect(currentFilter.where.age).toEqual({ gte: 30 })
  })

  it('debe eliminar el parámetro de la URL cuando se limpia el filtro', () => {
    const originalFilter: FilterQuery<TestUser> = {
      where: {
        name: { equals: 'John' },
      },
    }

    const encoded = createEncodedFilterParam(originalFilter)

    let currentUrl = `https://example.com/path?filter=${encodeURIComponent(encoded)}&other=value`

    const service = createUrlFilterService<TestUser>({
      getUrl: () => currentUrl,
      setUrl: (url) => {
        currentUrl = url
      },
    })

    service.clearFilter()

    const url = new URL(currentUrl)

    expect(url.searchParams.has('filter')).toBe(false)
    expect(url.searchParams.get('other')).toBe('value')
    expect(service.getFilter()).toEqual({ where: {} })
  })

  it('debe ser reactivo y notificar a los suscriptores cuando cambia el filtro', () => {
    let currentUrl = 'https://example.com/path'

    const service = createUrlFilterService<TestUser>({
      getUrl: () => currentUrl,
      setUrl: (url) => {
        currentUrl = url
      },
    })

    const listener = vi.fn()

    const unsubscribe = service.subscribe(listener)

    const newFilter: FilterQuery<TestUser> = {
      where: {
        age: { gt: 18 },
      },
    }

    service.setFilter(newFilter)

    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith(newFilter)

    unsubscribe()

    service.clearFilter()

    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('debe sincronizarse desde la URL cuando se llama a syncFromUrl', () => {
    const firstFilter: FilterQuery<TestUser> = {
      where: {
        name: { equals: 'John' },
      },
    }

    const secondFilter: FilterQuery<TestUser> = {
      where: {
        name: { equals: 'Alice' },
        age: { gte: 20 },
      },
    }

    let currentUrl = `https://example.com/path?filter=${encodeURIComponent(createEncodedFilterParam(firstFilter))}`

    const service = createUrlFilterService<TestUser>({
      getUrl: () => currentUrl,
      setUrl: (url) => {
        currentUrl = url
      },
    })

    expect(service.getFilter()).toEqual(firstFilter)

    currentUrl = `https://example.com/path?filter=${encodeURIComponent(createEncodedFilterParam(secondFilter))}`

    service.syncFromUrl()

    expect(service.getFilter()).toEqual(secondFilter)
  })

  it('debe permitir personalizar la clave del parámetro de la URL', () => {
    const filter: FilterQuery<TestUser> = {
      where: {
        name: { equals: 'John' },
      },
    }

    const encoded = createEncodedFilterParam(filter)

    let currentUrl = `https://example.com/path?customFilter=${encodeURIComponent(encoded)}`

    const service = createUrlFilterService<TestUser>({
      paramKey: 'customFilter',
      getUrl: () => currentUrl,
      setUrl: (url) => {
        currentUrl = url
      },
    })

    expect(service.getFilter()).toEqual(filter)

    service.clearFilter()

    const url = new URL(currentUrl)

    expect(url.searchParams.has('customFilter')).toBe(false)
  })
})
