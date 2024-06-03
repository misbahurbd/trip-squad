"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tripBuddyService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_client_1 = __importDefault(require("../../../utils/prisma-client"));
const app_error_1 = require("../../errors/app-error");
const query_helpers_1 = require("../../../helpers/query-helpers");
const trip_buddy_constant_1 = require("./trip-buddy.constant");
const tripBuddyRequest = (userId, tripId, tripBuddyData) => __awaiter(void 0, void 0, void 0, function* () {
    const isTripBuddyExist = yield prisma_client_1.default.tripBuddy.findFirst({
        where: {
            userId,
            tripId,
        },
    });
    if (isTripBuddyExist) {
        throw new app_error_1.AppError(http_status_1.default.BAD_REQUEST, "Your request already send!");
    }
    const tripBuddy = yield prisma_client_1.default.tripBuddy.create({
        data: Object.assign({ userId,
            tripId }, tripBuddyData),
    });
    return tripBuddy;
});
const tripBuddyRequestByUserId = (userId, query, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, query_helpers_1.parseOptions)(options);
    const searchFilter = (0, query_helpers_1.parseTripBuddySearchOptions)(query, trip_buddy_constant_1.tripBuddySearchFields);
    const requests = yield prisma_client_1.default.tripBuddy.findMany({
        where: {
            AND: searchFilter,
            trip: {
                creatorId: userId,
            },
            status: "Pending",
        },
        include: {
            trip: true,
            user: {
                select: {
                    username: true,
                    profile: true,
                },
            },
        },
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const total = yield prisma_client_1.default.tripBuddy.count({
        where: {
            AND: searchFilter,
            trip: {
                creatorId: userId,
            },
            status: "Pending",
        },
    });
    return {
        data: requests,
        meta: {
            page,
            limit,
            total,
        },
    };
});
const tripBuddyResponse = (buddyId_1, _a) => __awaiter(void 0, [buddyId_1, _a], void 0, function* (buddyId, { status }) {
    const tripBuddy = yield prisma_client_1.default.tripBuddy.update({
        where: {
            id: buddyId,
            status: "Pending",
        },
        data: {
            status,
        },
    });
    return tripBuddy;
});
const tripBuddyRequestHistory = (userId, query, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = (0, query_helpers_1.parseOptions)(options);
    const searchFilter = (0, query_helpers_1.parseTripBuddyHistorySearchOptions)(query, trip_buddy_constant_1.tripBuddySearchFields);
    const requests = yield prisma_client_1.default.tripBuddy.findMany({
        where: {
            AND: searchFilter,
            userId,
        },
        include: {
            trip: {
                include: {
                    createdBy: {
                        select: {
                            profile: true,
                        },
                    },
                },
            },
            user: {
                select: {
                    username: true,
                    profile: true,
                },
            },
        },
        skip,
        take: limit,
        orderBy: {
            updatedAt: "desc",
        },
    });
    const total = yield prisma_client_1.default.tripBuddy.count({
        where: {
            AND: searchFilter,
            userId,
        },
    });
    return {
        data: requests,
        meta: {
            page,
            limit,
            total,
        },
    };
});
const tripBuddies = (userId, query, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, query_helpers_1.parseOptions)(options);
    const searchFilter = (0, query_helpers_1.parseTripBuddisSearchOptions)(query, trip_buddy_constant_1.tripBuddySearchFields);
    const buddies = yield prisma_client_1.default.tripBuddy.findMany({
        where: {
            AND: searchFilter,
            OR: [
                {
                    userId,
                },
                {
                    trip: {
                        creatorId: userId,
                    },
                },
            ],
            status: "Approved",
        },
        include: {
            trip: {
                include: {
                    tripBuddy: {
                        where: {
                            status: "Approved",
                        },
                        select: {
                            user: {
                                select: {
                                    profile: true,
                                },
                            },
                        },
                    },
                    createdBy: {
                        select: {
                            profile: true,
                        },
                    },
                },
            },
        },
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const total = yield prisma_client_1.default.tripBuddy.count({
        where: {
            AND: searchFilter,
            OR: [
                {
                    userId,
                },
                {
                    trip: {
                        creatorId: userId,
                    },
                },
            ],
            status: "Approved",
        },
    });
    return {
        data: buddies,
        meta: {
            page,
            limit,
            total,
        },
    };
});
exports.tripBuddyService = {
    tripBuddyRequest,
    tripBuddyRequestByUserId,
    tripBuddyResponse,
    tripBuddyRequestHistory,
    tripBuddies,
};
