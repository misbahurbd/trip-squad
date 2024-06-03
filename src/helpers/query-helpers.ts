export interface IOptions {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: string
}

export const parseOptions = (options: IOptions) => {
  const page: number = Number(options.page) || 1
  const limit: number = Number(options.limit) || 12
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
          case "tripType":
            const triptypes = value.toString().split(",")
            query = {
              tripType: {
                in: triptypes,
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

export const parseUserFilterOptions = (
  query: Record<string, string | number>,
  searchFields: string[]
) => {
  const { searchTerm } = query
  const filterCondition = []
  const searchableField = searchFields

  if (searchTerm) {
    filterCondition.push({
      OR: searchableField.map(field => {
        switch (field) {
          case "name":
            return {
              profile: {
                name: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
            }
          case "mobile":
            return {
              profile: {
                mobile: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
            }
          default:
            return {
              [field]: {
                contains: searchTerm,
                mode: "insensitive",
              },
            }
        }
      }),
    })
  }

  return filterCondition
}

export const parseTripBuddySearchOptions = (
  query: Record<string, string | number>,
  searchFields: string[]
) => {
  const { searchTerm } = query
  const filterCondition = []
  const searchableField = searchFields

  if (searchTerm) {
    filterCondition.push({
      OR: searchableField.map(field => {
        switch (field) {
          case "destination":
            return {
              trip: {
                destination: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
            }
          case "location":
            return {
              trip: {
                location: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
            }
          case "username":
            return {
              user: {
                username: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
            }
          default:
            return {
              [field]: {
                contains: searchTerm,
                mode: "insensitive",
              },
            }
        }
      }),
    })
  }

  return filterCondition
}

export const parseTripBuddyHistorySearchOptions = (
  query: Record<string, string | number>,
  searchFields: string[]
) => {
  const { searchTerm } = query
  const filterCondition = []
  const searchableField = searchFields

  if (searchTerm) {
    filterCondition.push({
      OR: searchableField.map(field => {
        switch (field) {
          case "destination":
            return {
              trip: {
                destination: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
            }
          case "location":
            return {
              trip: {
                location: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
            }
          case "username":
            return {
              trip: {
                createdBy: {
                  username: {
                    contains: searchTerm,
                    mode: "insensitive",
                  },
                },
              },
            }
          case "email":
            return {
              trip: {
                createdBy: {
                  email: {
                    contains: searchTerm,
                    mode: "insensitive",
                  },
                },
              },
            }
          case "name":
            return {
              trip: {
                createdBy: {
                  profile: {
                    name: {
                      contains: searchTerm,
                      mode: "insensitive",
                    },
                  },
                },
              },
            }
          case "mobile":
            return {
              trip: {
                createdBy: {
                  profile: {
                    mobile: {
                      contains: searchTerm,
                      mode: "insensitive",
                    },
                  },
                },
              },
            }
          default:
            return {
              [field]: {
                contains: searchTerm,
                mode: "insensitive",
              },
            }
        }
      }),
    })
  }

  return filterCondition
}
export const parseTripBuddisSearchOptions = (
  query: Record<string, string | number>,
  searchFields: string[]
) => {
  const { searchTerm } = query
  const filterCondition = []
  const searchableField = searchFields

  if (searchTerm) {
    filterCondition.push({
      OR: searchableField.map(field => {
        switch (field) {
          case "username":
            return {
              tripBuddy: {
                some: {
                  OR: [
                    {
                      user: {
                        [field]: {
                          contains: searchTerm,
                          mode: "insensitive",
                        },
                      },
                    },
                    {
                      trip: {
                        createdBy: {
                          [field]: {
                            contains: searchTerm,
                            mode: "insensitive",
                          },
                        },
                      },
                    },
                  ],
                },
              },
            }
          case "email":
            return {
              tripBuddy: {
                some: {
                  OR: [
                    {
                      [field]: {
                        contains: searchTerm,
                        mode: "insensitive",
                      },
                    },
                    {
                      trip: {
                        createdBy: {
                          profile: {
                            [field]: {
                              contains: searchTerm,
                              mode: "insensitive",
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              },
            }
          case "name":
            return {
              tripBuddy: {
                some: {
                  OR: [
                    {
                      trip: {
                        createdBy: {
                          profile: {
                            [field]: {
                              contains: searchTerm,
                              mode: "insensitive",
                            },
                          },
                        },
                      },
                    },
                    {
                      [field]: {
                        contains: searchTerm,
                        mode: "insensitive",
                      },
                    },
                  ],
                },
              },
            }
          case "mobile":
            return {
              tripBuddy: {
                some: {
                  OR: [
                    {
                      trip: {
                        createdBy: {
                          profile: {
                            [field]: {
                              contains: searchTerm,
                              mode: "insensitive",
                            },
                          },
                        },
                      },
                    },
                    {
                      [field]: {
                        contains: searchTerm,
                        mode: "insensitive",
                      },
                    },
                  ],
                },
              },
            }
          default:
            return {
              [field]: {
                contains: searchTerm,
                mode: "insensitive",
              },
            }
        }
      }),
    })
  }

  return filterCondition
}
