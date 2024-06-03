"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tripValidation = void 0;
const zod_1 = require("zod");
const tripSchema = zod_1.z.object({
    destination: zod_1.z.string().min(1, { message: "Destination is required" }),
    description: zod_1.z.string().min(1, { message: "Description is required" }),
    location: zod_1.z.string().min(1, { message: "Location is required" }),
    startDate: zod_1.z.string().min(1, { message: "Start date is required" }),
    endDate: zod_1.z.string().min(1, { message: "End date is required" }),
    tripType: zod_1.z.string().min(1, { message: "Trip type is required" }),
    budget: zod_1.z.number().min(1, { message: "Budget is required" }),
    itinerary: zod_1.z.string().min(1, { message: "Itinerary is required" }),
});
exports.tripValidation = {
    tripSchema,
};
