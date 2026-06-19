import mongoose from "mongoose";
import { Reservation } from "../models/reservation.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import { Seat } from "../models/seat.model.js";
import { Booking } from "../models/booking.model.js";

export const confirmBooking = async (userId: string, reservationId: string) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const reservation =
      await Reservation.findById(reservationId).session(session);

    if (!reservation) {
      throw new ErrorHandler(404, "Reservation is not found!");
    }

    if (reservation.userId.toString() !== userId) {
      throw new ErrorHandler(
        403,
        "You are not authorized to book this reservation",
      );
    }

    if (reservation.expiredAt < new Date()) {
      throw new ErrorHandler(400, "Reservation is expired!");
    }

    const seats = await Seat.find({
      eventId: reservation.eventId,
      seatNumber: {
        $in: reservation.seatNumbers,
      },
    }).session(session);

    const invalidSeat = seats.find((seat) => seat.status !== "reserved");

    if (invalidSeat) {
      throw new ErrorHandler(
        400,
        `Seat ${invalidSeat.seatNumber} is not reserved`,
      );
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

    const booking = await Booking.create(
      [
        {
          userId,
          eventId: reservation.eventId,
          seatNumbers: reservation.seatNumbers,
        },
      ],
      {
        session,
      },
    );

    await session.commitTransaction();

    return booking[0];
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }
};

export const getMyBookings = async (userId: string, page: number) => {
  const limit = 9;
  const skip = (page - 1) * limit;

  const [bookings, total] = await Promise.all([
    Booking.find({ userId })
      .populate("eventId", "name venue dateTime")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Booking.countDocuments({ userId }),
  ]);

  return {
    bookings,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
};
