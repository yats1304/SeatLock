import mongoose from "mongoose";
import { Event } from "../models/event.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import { Seat } from "../models/seat.model.js";
import { Reservation } from "../models/reservation.model.js";

export const reserveSeats = async (
  userId: string,
  eventId: string,
  seatNumbers: string[],
) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const event = await Event.findById(eventId).session(session);

    if (!event) {
      throw new ErrorHandler(404, "Event not found!");
    }

    const seats = await Seat.find({
      eventId,
      seatNumber: {
        $in: seatNumbers,
      },
    }).session(session);

    if (seats.length !== seatNumbers.length) {
      throw new ErrorHandler(400, "One or more seats do not exits!");
    }

    const unavailableSeat = seats.find((seat) => seat.status !== "available");

    if (unavailableSeat) {
      throw new ErrorHandler(
        400,
        `Seat ${unavailableSeat.seatNumber} is not available`,
      );
    }

    const expiredAt = new Date(Date.now() + 10 * 60 * 1000);

    await Seat.updateMany(
      {
        eventId,
        seatNumber: {
          $in: seatNumbers,
        },
      },
      {
        status: "reserved",
        reservedUntil: expiredAt,
      },
      {
        session,
      },
    );

    const reservation = await Reservation.create(
      [
        {
          userId,
          eventId,
          seatNumbers,
          expiredAt,
        },
      ],
      {
        session,
      },
    );

    await session.commitTransaction();

    return reservation[0];
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }
};
