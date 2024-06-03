"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tripBuddyRoutes = void 0;
const express_1 = __importDefault(require("express"));
const check_auth_1 = require("../../middlewares/check-auth");
const trip_buddy_controller_1 = require("./trip-buddy.controller");
const router = express_1.default.Router();
router.get("/", (0, check_auth_1.checkAuth)("User"), trip_buddy_controller_1.tripBuddyController.tripBuddyRequestByUserId);
router.get("/history", (0, check_auth_1.checkAuth)("User"), trip_buddy_controller_1.tripBuddyController.tripBuddyRequestHistory);
router.get("/buddies", (0, check_auth_1.checkAuth)("User"), trip_buddy_controller_1.tripBuddyController.tripBuddies);
router.post("/request/:tripId", (0, check_auth_1.checkAuth)("User"), trip_buddy_controller_1.tripBuddyController.tripBuddyRequest);
router.put("/response/:buddyId", (0, check_auth_1.checkAuth)("User"), trip_buddy_controller_1.tripBuddyController.tripBuddyResponse);
exports.tripBuddyRoutes = router;
