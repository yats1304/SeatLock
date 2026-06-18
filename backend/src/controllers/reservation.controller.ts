import { TryCatch } from "../utils/tryCatch.js";
import * as reservationService from "../services/reservation.service.js";
import ErrorHandler from "../utils/errorHandler.js";

export const reserveSeats = TryCatch(async (req, res) => {
  const eventId = req.params.eventId as string;
  const { seatNumbers } = req.body;

  if (!req.user) {
    throw new ErrorHandler(401, "Please login first!");
  }
  const userId = req.user._id.toString();

  const reservation = await reservationService.reserveSeats(
    userId,
    eventId,
    seatNumbers,
  );

  res.status(201).json({
    message: "Seat reserved successfully!",
    reservation,
  });
});
