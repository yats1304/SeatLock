import { model, Schema } from "mongoose";
import { IBooking } from "../types/booking.types.js";

const bookingSchema = new Schema<IBooking>(
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

    bookedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

export const Booking = model<IBooking>("Booking", bookingSchema);
