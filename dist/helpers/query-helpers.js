"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTripBuddisSearchOptions = exports.parseTripBuddyHistorySearchOptions = exports.parseTripBuddySearchOptions = exports.parseUserFilterOptions = exports.parseFilterOptions = exports.parseOptions = void 0;
const parseOptions = (options) => {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 12;
    const skip = (page - 1) * limit;
    const sortBy = options.sortBy || "createdAt";
    const sortOrder = options.sortOrder || "desc";
    return { page, limit, skip, sortBy, sortOrder };
};
exports.parseOptions = parseOptions;
const parseFilterOptions = (query, searchFields) => {
    const { searchTerm } = query, filterField = __rest(query, ["searchTerm"]);
    const filterCondition = [];
    const searchableField = searchFields;
    if (searchTerm) {
        filterCondition.push({
            OR: searchableField.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(filterField).length > 0) {
        filterCondition.push({
            AND: Object.entries(filterField).map(([key, value]) => {
                let query;
                switch (key) {
                    case "startDate":
                        query = {
                            startDate: {
                                gte: new Date(value),
                            },
                        };
                        break;
                    case "endDate":
                        query = {
                            endDate: {
                                lte: new Date(value),
                            },
                        };
                        break;
                    case "budget":
                        query = {
                            budget: {
                                lte: Number(value),
                            },
                        };
                        break;
                    case "minBudget":
                        query = {
                            budget: {
                                gte: Number(value),
                            },
                        };
                        break;
                    case "maxBudget":
                        query = {
                            budget: {
                                lte: Number(value),
                            },
                        };
                        break;
                    case "tripType":
                        const triptypes = value.toString().split(",");
                        query = {
                            tripType: {
                                in: triptypes,
                            },
                        };
                        break;
                    default:
                        query = {
                            [key]: {
                                equals: value,
                            },
                        };
                        break;
                }
                return query;
            }),
        });
    }
    return filterCondition;
};
exports.parseFilterOptions = parseFilterOptions;
const parseUserFilterOptions = (query, searchFields) => {
    const { searchTerm } = query;
    const filterCondition = [];
    const searchableField = searchFields;
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
                        };
                    case "mobile":
                        return {
                            profile: {
                                mobile: {
                                    contains: searchTerm,
                                    mode: "insensitive",
                                },
                            },
                        };
                    default:
                        return {
                            [field]: {
                                contains: searchTerm,
                                mode: "insensitive",
                            },
                        };
                }
            }),
        });
    }
    return filterCondition;
};
exports.parseUserFilterOptions = parseUserFilterOptions;
const parseTripBuddySearchOptions = (query, searchFields) => {
    const { searchTerm } = query;
    const filterCondition = [];
    const searchableField = searchFields;
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
                        };
                    case "location":
                        return {
                            trip: {
                                location: {
                                    contains: searchTerm,
                                    mode: "insensitive",
                                },
                            },
                        };
                    case "username":
                        return {
                            user: {
                                username: {
                                    contains: searchTerm,
                                    mode: "insensitive",
                                },
                            },
                        };
                    default:
                        return {
                            [field]: {
                                contains: searchTerm,
                                mode: "insensitive",
                            },
                        };
                }
            }),
        });
    }
    return filterCondition;
};
exports.parseTripBuddySearchOptions = parseTripBuddySearchOptions;
const parseTripBuddyHistorySearchOptions = (query, searchFields) => {
    const { searchTerm } = query;
    const filterCondition = [];
    const searchableField = searchFields;
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
                        };
                    case "location":
                        return {
                            trip: {
                                location: {
                                    contains: searchTerm,
                                    mode: "insensitive",
                                },
                            },
                        };
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
                        };
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
                        };
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
                        };
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
                        };
                    default:
                        return {
                            [field]: {
                                contains: searchTerm,
                                mode: "insensitive",
                            },
                        };
                }
            }),
        });
    }
    return filterCondition;
};
exports.parseTripBuddyHistorySearchOptions = parseTripBuddyHistorySearchOptions;
const parseTripBuddisSearchOptions = (query, searchFields) => {
    const { searchTerm } = query;
    const filterCondition = [];
    const searchableField = searchFields;
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
                        };
                    case "location":
                        return {
                            trip: {
                                location: {
                                    contains: searchTerm,
                                    mode: "insensitive",
                                },
                            },
                        };
                    case "username":
                        return {
                            trip: {
                                OR: [
                                    {
                                        tripBuddy: {
                                            some: {
                                                user: {
                                                    username: {
                                                        contains: searchTerm,
                                                        mode: "insensitive",
                                                    },
                                                },
                                            },
                                        },
                                    },
                                    {
                                        createdBy: {
                                            username: {
                                                contains: searchTerm,
                                                mode: "insensitive",
                                            },
                                        },
                                    },
                                ],
                            },
                        };
                    case "email":
                        return {
                            trip: {
                                OR: [
                                    {
                                        tripBuddy: {
                                            some: {
                                                email: {
                                                    contains: searchTerm,
                                                    mode: "insensitive",
                                                },
                                            },
                                        },
                                    },
                                    {
                                        createdBy: {
                                            email: {
                                                contains: searchTerm,
                                                mode: "insensitive",
                                            },
                                        },
                                    },
                                ],
                            },
                        };
                    case "name":
                        return {
                            trip: {
                                OR: [
                                    {
                                        tripBuddy: {
                                            some: {
                                                name: {
                                                    contains: searchTerm,
                                                    mode: "insensitive",
                                                },
                                            },
                                        },
                                    },
                                    {
                                        createdBy: {
                                            profile: {
                                                name: {
                                                    contains: searchTerm,
                                                    mode: "insensitive",
                                                },
                                            },
                                        },
                                    },
                                ],
                            },
                        };
                    case "mobile":
                        return {
                            trip: {
                                OR: [
                                    {
                                        tripBuddy: {
                                            some: {
                                                mobile: {
                                                    contains: searchTerm,
                                                    mode: "insensitive",
                                                },
                                            },
                                        },
                                    },
                                    {
                                        createdBy: {
                                            profile: {
                                                mobile: {
                                                    contains: searchTerm,
                                                    mode: "insensitive",
                                                },
                                            },
                                        },
                                    },
                                ],
                            },
                        };
                    default:
                        return {
                            [field]: {
                                contains: searchTerm,
                                mode: "insensitive",
                            },
                        };
                }
            }),
        });
    }
    return filterCondition;
};
exports.parseTripBuddisSearchOptions = parseTripBuddisSearchOptions;
