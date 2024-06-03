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
Object.defineProperty(exports, "__esModule", { value: true });
exports.tripBuddyController = void 0;
const catch_async_1 = require("../../../utils/catch-async");
const pick_query_1 = require("../../../utils/pick-query");
const send_response_1 = require("../../../utils/send-response");
const trip_buddy_constant_1 = require("./trip-buddy.constant");
const trip_buddy_service_1 = require("./trip-buddy.service");
const tripBuddyRequest = (0, catch_async_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const tripId = req.params.tripId;
    const result = yield trip_buddy_service_1.tripBuddyService.tripBuddyRequest(user.id, tripId, req.body);
    (0, send_response_1.sendResponse)(res, {
        message: "Trip buddy request sent successfully",
        data: result,
    });
}));
const tripBuddyRequestByUserId = (0, catch_async_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const query = (0, pick_query_1.pickQueryTerms)(req.query, trip_buddy_constant_1.tripBuddyQueryFields);
    const options = (0, pick_query_1.pickQueryTerms)(req.query, [
        "limit",
        "page",
        "sortBy",
        "sortOrder",
    ]);
    const result = yield trip_buddy_service_1.tripBuddyService.tripBuddyRequestByUserId(user.id, query, options);
    (0, send_response_1.sendResponse)(res, {
        message: "Trip buddy requests retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const tripBuddyResponse = (0, catch_async_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const buddyId = req.params.buddyId;
    const result = yield trip_buddy_service_1.tripBuddyService.tripBuddyResponse(buddyId, req.body);
    (0, send_response_1.sendResponse)(res, {
        message: "Trip buddy response sent successfully",
        data: result,
    });
}));
const tripBuddyRequestHistory = (0, catch_async_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const query = (0, pick_query_1.pickQueryTerms)(req.query, trip_buddy_constant_1.tripBuddyQueryFields);
    const options = (0, pick_query_1.pickQueryTerms)(req.query, [
        "limit",
        "page",
        "sortBy",
        "sortOrder",
    ]);
    const result = yield trip_buddy_service_1.tripBuddyService.tripBuddyRequestHistory(user.id, query, options);
    (0, send_response_1.sendResponse)(res, {
        message: "Trip buddy requests history retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const tripBuddies = (0, catch_async_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const query = (0, pick_query_1.pickQueryTerms)(req.query, trip_buddy_constant_1.tripBuddyQueryFields);
    const options = (0, pick_query_1.pickQueryTerms)(req.query, [
        "limit",
        "page",
        "sortBy",
        "sortOrder",
    ]);
    const result = yield trip_buddy_service_1.tripBuddyService.tripBuddies(user.id, query, options);
    (0, send_response_1.sendResponse)(res, {
        message: "Trip buddies retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
exports.tripBuddyController = {
    tripBuddyRequest,
    tripBuddyRequestByUserId,
    tripBuddyResponse,
    tripBuddyRequestHistory,
    tripBuddies,
};
