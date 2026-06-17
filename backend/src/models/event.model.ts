import { model, Schema } from "mongoose";
import { IEvent } from "../types/event.types.js";

const eventSchema = new Schema<IEvent>(
  {
    name: {
      type: String,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    totalSeats: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  },
);

export const Event = model<IEvent>("Event", eventSchema);
