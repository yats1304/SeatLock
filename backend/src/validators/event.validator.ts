import { z } from "zod";

export const createEventSchema = z.object({
  name: z
    .string()
    .min(3, "Event name must be at least 3 characters long")
    .max(100, "Event name cannot exceed 100 characters"),

  venue: z
    .string()
    .min(3, "Venue must be at least 3 characters long")
    .max(200, "Venue cannot exceed 200 characters"),

  dateTime: z.coerce.date().refine((date) => date > new Date(), {
    message: "Event date must be in the future",
  }),

  totalSeats: z.coerce
    .number()
    .int("Total seats must be a whole number")
    .positive("Total seats must be greater than 0"),
});

export const updateEventSchema = createEventSchema.partial();

export const getEventsSchema = z.object({
  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(100).default(10),

  search: z.string().optional(),
});
