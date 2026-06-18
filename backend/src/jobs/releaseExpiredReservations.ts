import { Reservation } from "../models/reservation.model.js";
import { Seat } from "../models/seat.model.js";

export const releaseExpiredReservations = async (): Promise<void> => {
  const now = new Date();

  const [seatResult, reservationResult] = await Promise.all([
    Seat.updateMany(
      {
        status: "reserved",
        reservedUntil: {
          $lte: now,
        },
      },
      {
        $set: {
          status: "available",
        },
        $unset: {
          reservedUntil: 1,
        },
      },
    ),

    Reservation.deleteMany({
      expiredAt: {
        $lte: now,
      },
    }),
  ]);

  console.log(
    `[Reservation Cleanup] Released ${seatResult.modifiedCount} seats and removed ${reservationResult.deletedCount} expired reservations`,
  );
};
