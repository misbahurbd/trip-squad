export interface IOptions {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: string
}

export const parseOptions = (options: IOptions) => {
  const page: number = Number(options.page) || 1
  const limit: number = Number(options.limit) || 10
  const skip: number = (page - 1) * limit
  const sortBy: string = options.sortBy || "createdAt"
  const sortOrder: string = options.sortOrder || "desc"

  return { page, limit, skip, sortBy, sortOrder }
}

export const parseFilterOptions = (
  query: Record<string, string | number>,
  searchFields: string[]
) => {
  const { searchTerm, ...filterField } = query
  const filterCondition = []
  const searchableField = searchFields

  if (searchTerm) {
    filterCondition.push({
      OR: searchableField.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    })
  }

  if (Object.keys(filterField).length > 0) {
    filterCondition.push({
      AND: Object.entries(filterField).map(([key, value]) => {
        let query: {}

        switch (key) {
          case "startDate":
            query = {
              startDate: {
                gte: new Date(value),
              },
            }
            break
          case "endDate":
            query = {
              endDate: {
                lte: new Date(value),
              },
            }
            break
          case "budget":
            query = {
              budget: {
                lte: Number(value),
              },
            }
            break
          case "minBudget":
            query = {
              budget: {
                gte: Number(value),
              },
            }
            break
          case "maxBudget":
            query = {
              budget: {
                lte: Number(value),
              },
            }
            break
          default:
            query = {
              [key]: {
                equals: value,
              },
            }
            break
        }

        return query
      }),
    })
  }

  return filterCondition
}
