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
  const page = Math.max(1, parseInt(req.query.page as string) || 1);

  const { bookings, total, totalPages, currentPage } =
    await bookingService.getMyBookings(userId, page);

  res.json({
    message: "Booking fetch successfully!",
    bookings,
    pagination: {
      total,
      totalPages,
      currentPage,
      perPage: 9,
    },
  });
});
