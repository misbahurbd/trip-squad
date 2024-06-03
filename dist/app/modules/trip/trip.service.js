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
exports.tripService = void 0;
const prisma_client_1 = __importDefault(require("../../../utils/prisma-client"));
const query_helpers_1 = require("../../../helpers/query-helpers");
const trip_constant_1 = require("./trip.constant");
const cloudinary_1 = __importDefault(require("../../../utils/cloudinary"));
const app_error_1 = require("../../errors/app-error");
const http_status_1 = __importDefault(require("http-status"));
const createTrip = (user, files, tripData) => __awaiter(void 0, void 0, void 0, function* () {
    const uploadImages = files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
        const b64 = Buffer.from(file.buffer).toString("base64");
        const dataURI = "data:" + file.mimetype + ";base64," + b64;
        const result = yield (0, cloudinary_1.default)(dataURI);
        return result;
    }));
    const images = yield Promise.all(uploadImages);
    if (images.length == 0) {
        throw new app_error_1.AppError(http_status_1.default.BAD_REQUEST, "Unable to upload images");
    }
    const imgArray = images.map(img => {
        if (!img || !img.secure_url)
            return null;
        return img.secure_url;
    });
    const trip = yield prisma_client_1.default.trip.create({
        data: {
            destination: tripData.destination,
            startDate: tripData.startDate,
            endDate: tripData.endDate,
            tripType: tripData.tripType,
            description: tripData.description,
            budget: Number(tripData.budget),
            photos: imgArray,
            location: tripData.location,
            itinerary: tripData.itinerary,
            creatorId: user.id,
        },
    });
    return trip;
});
const updateTrip = (user, tripId, tripData) => __awaiter(void 0, void 0, void 0, function* () {
    switch (user.role) {
        case "Admin":
            const tripAdmin = yield prisma_client_1.default.trip.update({
                where: {
                    id: tripId,
                },
                data: {
                    destination: tripData.destination,
                    description: tripData.description,
                    startDate: tripData.startDate,
                    endDate: tripData.endDate,
                    tripType: tripData.tripType,
                    budget: Number(tripData.budget),
                    location: tripData.location,
                    itinerary: tripData.itinerary,
                },
            });
            return tripAdmin;
        case "User":
            const tripUser = yield prisma_client_1.default.trip.update({
                where: {
                    id: tripId,
                    creatorId: user.id,
                },
                data: {
                    destination: tripData.destination,
                    startDate: tripData.startDate,
                    endDate: tripData.endDate,
                    tripType: tripData.tripType,
                    description: tripData.description,
                    budget: Number(tripData.budget),
                    location: tripData.location,
                    itinerary: tripData.itinerary,
                    creatorId: user.id,
                },
            });
            if (!tripUser) {
                throw new app_error_1.AppError(http_status_1.default.NOT_FOUND, "Trip not found");
            }
            return tripUser;
        default:
            break;
    }
});
const getTrips = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, query_helpers_1.parseOptions)(options);
    const filterCondition = (0, query_helpers_1.parseFilterOptions)(query, trip_constant_1.tripSearchFields);
    const trips = yield prisma_client_1.default.trip.findMany({
        where: {
            AND: filterCondition,
            isDeleted: false,
        },
        include: {
            createdBy: {
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
    const total = yield prisma_client_1.default.trip.count({
        where: {
            AND: filterCondition,
            isDeleted: false,
        },
    });
    return {
        data: trips,
        meta: {
            page,
            limit,
            total,
        },
    };
});
const getMyTrips = (user, query, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, query_helpers_1.parseOptions)(options);
    const filterCondition = (0, query_helpers_1.parseFilterOptions)(query, trip_constant_1.tripSearchFields);
    const trips = yield prisma_client_1.default.trip.findMany({
        where: {
            AND: filterCondition,
            isDeleted: false,
            creatorId: user.id,
        },
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const total = yield prisma_client_1.default.trip.count({
        where: {
            AND: filterCondition,
            isDeleted: false,
            creatorId: user.id,
        },
    });
    return {
        data: trips,
        meta: {
            page,
            limit,
            total,
        },
    };
});
const getTripById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const trip = yield prisma_client_1.default.trip.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            createdBy: {
                select: {
                    username: true,
                    email: true,
                    profile: true,
                    _count: {
                        select: {
                            trip: {
                                where: {
                                    isDeleted: false,
                                },
                            },
                        },
                    },
                },
            },
            tripBuddy: {
                include: {
                    user: {
                        select: {
                            profile: true,
                        },
                    },
                },
            },
        },
    });
    return trip;
});
const topTripTypes = () => __awaiter(void 0, void 0, void 0, function* () {
    const tripTypes = yield prisma_client_1.default.trip.groupBy({
        by: ["tripType"],
        _count: {
            tripType: true,
        },
        where: {
            isDeleted: false,
        },
    });
    // Filter out trip types with a count of 0
    const filteredTripTypeCounts = tripTypes.filter(tripType => tripType._count.tripType > 0);
    const formattedResults = filteredTripTypeCounts.map(tripType => ({
        label: tripType.tripType,
        count: tripType._count.tripType,
    }));
    const sortedResults = formattedResults.sort((a, b) => b.count - a.count);
    return sortedResults;
});
const tripTypes = () => __awaiter(void 0, void 0, void 0, function* () {
    const tripTypes = yield prisma_client_1.default.trip.groupBy({
        by: ["tripType"],
        _count: {
            tripType: true,
        },
        where: {
            isDeleted: false,
        },
    });
    // Filter out trip types with a count of 0
    const filteredTripTypeCounts = tripTypes.filter(tripType => tripType._count.tripType > 0);
    const formattedResults = filteredTripTypeCounts.map(tripType => ({
        label: tripType.tripType,
        count: tripType._count.tripType,
    }));
    const sortedResults = formattedResults.sort();
    return sortedResults;
});
const tripsPhotos = () => __awaiter(void 0, void 0, void 0, function* () {
    const uniquePhotos = yield prisma_client_1.default.trip.findMany({
        select: {
            photos: true,
        },
        distinct: ["photos"],
    });
    const tripPhotos = [...new Set(uniquePhotos.flatMap(item => item.photos))];
    return tripPhotos;
});
const deleteTrip = (user, tripId) => __awaiter(void 0, void 0, void 0, function* () {
    switch (user.role) {
        case "Admin":
            const adminTrip = yield prisma_client_1.default.trip.update({
                where: {
                    id: tripId,
                },
                data: {
                    isDeleted: true,
                },
            });
            return adminTrip;
        case "User":
            const userTrip = yield prisma_client_1.default.trip.update({
                where: {
                    id: tripId,
                    creatorId: user.id,
                },
                data: {
                    isDeleted: true,
                },
            });
            if (!userTrip) {
                throw new app_error_1.AppError(http_status_1.default.BAD_REQUEST, "You don't have permission to delete this trip.");
            }
            return userTrip;
        default:
            return null;
    }
});
exports.tripService = {
    createTrip,
    updateTrip,
    getTrips,
    getMyTrips,
    getTripById,
    tripTypes,
    topTripTypes,
    tripsPhotos,
    deleteTrip,
};
