"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleRoutesd = void 0;
const express_1 = __importDefault(require("express"));
const auth_routes_1 = require("../modules/auth/auth.routes");
const user_routes_1 = require("../modules/user/user.routes");
const trip_routes_1 = require("../modules/trip/trip.routes");
const profile_routes_1 = require("../modules/profile/profile.routes");
const trip_buddy_routes_1 = require("../modules/trip-buddy/trip-buddy.routes");
const router = express_1.default.Router();
const routers = [
    {
        path: "/auth",
        router: auth_routes_1.authRoutes,
    },
    {
        path: "/users",
        router: user_routes_1.userRoutes,
    },
    {
        path: "/trips",
        router: trip_routes_1.tripRoutes,
    },
    {
        path: "/profiles",
        router: profile_routes_1.profileRoutes,
    },
    {
        path: "/trip-buddies",
        router: trip_buddy_routes_1.tripBuddyRoutes,
    },
];
routers.forEach(route => {
    router.use(route.path, route.router);
});
exports.moduleRoutesd = router;
