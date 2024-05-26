export const pickQueryTerms = <
  T extends Record<string, unknown>,
  K extends keyof T
>(
  queryObj: T,
  keys: K[]
) => {
  const finalQuery: Partial<T> = {}
  for (const key of keys) {
    if (queryObj && Object.hasOwnProperty.call(queryObj, key)) {
      finalQuery[key] = queryObj[key]
    }
  }
  return finalQuery
}
