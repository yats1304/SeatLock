import { z } from "zod";

export const createReservationSchema = z.object({
  seatNumbers: z.array(z.string()).min(1, "At least one seat must be selected"),
});

export const updateReservationSchema = createReservationSchema.partial();

export const getReservationsSchema = z.object({
  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(100).default(10),

  eventId: z.string().optional(),

  search: z.string().optional(),
});
