"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const index_routes_1 = require("./app/routes/index.routes");
const global_error_handler_1 = __importDefault(require("./app/middlewares/global-error-handler"));
const not_found_error_handler_1 = require("./app/middlewares/not-found-error-handler");
// initialize express application
const app = (0, express_1.default)();
// initialize parsers
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://tripsquad.vercel.app",
    ],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
// initialize application routes
app.use("/api/v1", index_routes_1.moduleRoutesd);
// not found handler
app.use(not_found_error_handler_1.notFoundErrorHandler);
// global error handler
app.use(global_error_handler_1.default);
exports.default = app;
