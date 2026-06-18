import mongoose from "mongoose";
import { Reservation } from "../models/reservation.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import { Seat } from "../models/seat.model.js";

export const confirmBooking = async (reservationId: string) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const reservation =
      await Reservation.findById(reservationId).session(session);

    if (!reservation) {
      throw new ErrorHandler(404, "Reservation is not found!");
    }

    if (reservation.expiredAt < new Date()) {
      throw new ErrorHandler(400, "Reservation is expired!");
    }

    await Seat.updateMany(
      {
        eventId: reservation.eventId,

        seatNumber: {
          $in: reservation.seatNumbers,
        },
      },
      {
        status: "booked",
        reservedUntil: null,
      },
      {
        session,
      },
    );

    await Reservation.findByIdAndDelete(reservationId, {
      session,
    });

    await session.commitTransaction();

    return {
      reservationId: reservation._id,

      eventId: reservation.eventId,

      seatNumbers: reservation.seatNumbers,
    };
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }
};
