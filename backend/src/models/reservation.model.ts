import { model, Schema } from "mongoose";
import { IReservation } from "../types/reservation.type.js";

const reservationSchema = new Schema<IReservation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    seatNumbers: [
      {
        type: String,
        required: true,
      },
    ],

    expiredAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

reservationSchema.index(
  {
    expiresAt: 1,
  },
  {
    expireAfterSeconds: 0,
  },
);

export const Reservation = model<IReservation>(
  "Reservation",
  reservationSchema,
);
