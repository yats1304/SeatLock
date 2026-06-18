import { Document, Types } from "mongoose";

export interface IBooking extends Document {
  userId: Types.ObjectId;
  eventId: Types.ObjectId;
  seatNumbers: string[];
  bookedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
