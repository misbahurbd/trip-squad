import { z } from "zod"

const tripSchema = z.object({
  destination: z.string().min(1, { message: "Destination is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().min(1, { message: "End date is required" }),
  tripType: z.string().min(1, { message: "Trip type is required" }),
  budget: z.number().min(1, { message: "Budget is required" }),
  itinerary: z.string().min(1, { message: "Itinerary is required" }),
})

export const tripValidation = {
  tripSchema,
}
