import { FilterQuery } from '../filter/filter.interface'

export const queryFilterToUrlParams = <T>(
  queryFilter: FilterQuery<T>
): string => {
  const jsonString = JSON.stringify(queryFilter)
  return btoa(jsonString)
}
export const urlParamsToQueryFilter = <T>(
  encodedString: string
): FilterQuery<T> => {
  try {
    const jsonString = atob(encodedString)
    const parsedFilter = JSON.parse(jsonString) as FilterQuery<T>
    if (!parsedFilter.where) {
      throw new Error("Invalid FilterQuery: Missing 'where' property.")
    }
    return parsedFilter
  } catch (error) {
    console.error('Error decoding FilterQuery:', error)
    return { where: {} } as FilterQuery<T>
  }
}
