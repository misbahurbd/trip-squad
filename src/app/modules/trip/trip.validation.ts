import { z } from "zod"

export const createTripSchema = z.object({
  destination: z.string().min(1, "Destination is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().min(1, { message: "End date is required" }),
  tripType: z.string().min(1, { message: "Trip type is required" }),
  photos: z.array(z.string()),
  budget: z.number().min(1, { message: "Budget is required" }),
})
