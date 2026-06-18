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

    const existingSeatNumbers = seats.map((seat) => seat.seatNumber);
    const nonExistingSeats = seatNumbers.filter(
      (sn) => !existingSeatNumbers.includes(sn),
    );

    if (nonExistingSeats.length > 0) {
      const seatWord = nonExistingSeats.length > 1 ? "Seats" : "Seat";
      const verb = nonExistingSeats.length > 1 ? "do" : "does";
      throw new ErrorHandler(
        400,
        `${seatWord} ${nonExistingSeats.join(", ")} ${verb} not exist!`,
      );
    }

    const unavailableSeats = seats.filter((seat) => seat.status !== "available");

    if (unavailableSeats.length > 0) {
      const seatNumbersStr = unavailableSeats.map((seat) => seat.seatNumber).join(", ");
      const seatWord = unavailableSeats.length > 1 ? "Seats" : "Seat";
      const verb = unavailableSeats.length > 1 ? "are" : "is";
      throw new ErrorHandler(
        400,
        `${seatWord} ${seatNumbersStr} ${verb} not available`,
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

export const getMyReservations = async (userId: string) => {
  const reservations = await Reservation.find({ userId })
    .populate("eventId", "name venue dateTime")
    .sort({
      createdAt: -1,
    });

  return reservations;
};
