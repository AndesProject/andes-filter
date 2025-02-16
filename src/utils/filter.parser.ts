import { QueryFilter } from '@app/filter'

export const queryFilterToUrlParams = <T>(
  queryFilter: QueryFilter<T>
): string => {
  const jsonString = JSON.stringify(queryFilter)
  return btoa(jsonString)
}

export const urlParamsToQueryFilter = <T>(
  encodedString: string
): QueryFilter<T> => {
  try {
    const jsonString = atob(encodedString)
    const parsedFilter = JSON.parse(jsonString) as QueryFilter<T>

    if (!parsedFilter.where) {
      throw new Error("Invalid QueryFilter: Missing 'where' property.")
    }

    return parsedFilter
  } catch (error) {
    console.error('Error decoding QueryFilter:', error)
    return { where: {} } as QueryFilter<T>
  }
}
