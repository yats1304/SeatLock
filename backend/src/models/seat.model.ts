import { model, Schema } from "mongoose";
import { ISeat } from "../types/seat.types.js";

const seatSchema = new Schema<ISeat>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    seatNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "reserved", "booked"],
      default: "available",
    },
  },
  {
    timestamps: true,
  },
);

seatSchema.index(
  {
    eventId: 1,
    seatNumber: 1,
  },
  {
    unique: true,
  },
);

export const Seat = model<ISeat>("Seat", seatSchema);
