import { TryCatch } from "../utils/tryCatch.js";
import * as bookingService from "../services/booking.service.js";
import ErrorHandler from "../utils/errorHandler.js";

export const confirmBooking = TryCatch(async (req, res) => {
  const reservationId = req.params.reservationId as string;

  if (!req.user) {
    throw new ErrorHandler(401, "Please login first!");
  }
  const userId = req.user._id.toString();

  const booking = await bookingService.confirmBooking(userId, reservationId);

  res.json({
    message: "Booking confirm successfully",
    booking,
  });
});

export const getMyBookings = TryCatch(async (req, res) => {
  if (!req.user) {
    throw new ErrorHandler(401, "Please login first!");
  }
  const userId = req.user._id.toString();

  const bookings = await bookingService.getMyBookings(userId);

  res.json({
    message: "Booking fetch successfully!",
    bookings,
  });
});
