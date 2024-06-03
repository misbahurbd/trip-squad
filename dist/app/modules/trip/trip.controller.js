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
exports.tripController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catch_async_1 = require("../../../utils/catch-async");
const send_response_1 = require("../../../utils/send-response");
const trip_service_1 = require("./trip.service");
const pick_query_1 = require("../../../utils/pick-query");
const trip_constant_1 = require("./trip.constant");
const app_error_1 = require("../../errors/app-error");
const trip_validation_1 = require("./trip.validation");
const createTrip = (0, catch_async_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    const data = JSON.parse(req.body.data);
    trip_validation_1.tripValidation.tripSchema.parseAsync(data);
    if (!files || files.length == 0) {
        throw new app_error_1.AppError(http_status_1.default.BAD_REQUEST, "Trip image is required");
    }
    const currentUser = req.user;
    const result = yield trip_service_1.tripService.createTrip(currentUser, files, data);
    (0, send_response_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        message: "Trip created successfully",
        data: result,
    });
}));
const updateTrip = (0, catch_async_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUser = req.user;
    const result = yield trip_service_1.tripService.updateTrip(currentUser, req.params.tripId, req.body);
    (0, send_response_1.sendResponse)(res, {
        message: "Trip update successfully",
        data: result,
    });
}));
const getTrips = (0, catch_async_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = (0, pick_query_1.pickQueryTerms)(req.query, trip_constant_1.tripQueryFields);
    const options = (0, pick_query_1.pickQueryTerms)(req.query, [
        "limit",
        "page",
        "sortBy",
        "sortOrder",
    ]);
    const result = yield trip_service_1.tripService.getTrips(query, options);
    (0, send_response_1.sendResponse)(res, {
        message: "Trips data retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const getMyTrips = (0, catch_async_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUser = req.user;
    const query = (0, pick_query_1.pickQueryTerms)(req.query, trip_constant_1.tripQueryFields);
    const options = (0, pick_query_1.pickQueryTerms)(req.query, [
        "limit",
        "page",
        "sortBy",
        "sortOrder",
    ]);
    const result = yield trip_service_1.tripService.getMyTrips(currentUser, query, options);
    (0, send_response_1.sendResponse)(res, {
        message: "Trips data retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const getTripById = (0, catch_async_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield trip_service_1.tripService.getTripById(req.params.tripId);
    (0, send_response_1.sendResponse)(res, {
        message: "Trip data retrieved successfully",
        data: result,
    });
}));
const tripTypes = (0, catch_async_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield trip_service_1.tripService.tripTypes();
    (0, send_response_1.sendResponse)(res, {
        message: "Trip types retrieved successfully",
        data: result,
    });
}));
const topTripTypes = (0, catch_async_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield trip_service_1.tripService.topTripTypes();
    (0, send_response_1.sendResponse)(res, {
        message: "Top trip types retrieved successfully",
        data: result,
    });
}));
const tripPhotos = (0, catch_async_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield trip_service_1.tripService.tripsPhotos();
    (0, send_response_1.sendResponse)(res, {
        message: "Trip photos retrieved successfully",
        data: result,
    });
}));
const deleteTrip = (0, catch_async_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    yield trip_service_1.tripService.deleteTrip(user, req.params.tripId);
    (0, send_response_1.sendResponse)(res, {
        message: "Trip deleted successfully",
        data: null,
    });
}));
exports.tripController = {
    createTrip,
    updateTrip,
    getTrips,
    getMyTrips,
    getTripById,
    tripTypes,
    topTripTypes,
    tripPhotos,
    deleteTrip,
};
