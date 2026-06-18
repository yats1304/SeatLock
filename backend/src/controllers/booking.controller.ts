import { TryCatch } from "../utils/tryCatch.js";
import * as bookingService from "../services/booking.service.js";

export const confirmBooking = TryCatch(async (req, res) => {
  const reservationId = req.params.reservationId as string;

  const booking = await bookingService.confirmBooking(reservationId);

  res.json({
    message: "Booking confirm successfully",
    booking,
  });
});
