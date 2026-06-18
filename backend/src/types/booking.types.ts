import { Document, Types } from "mongoose";

export interface IBooking extends Document {
  reservationId: Types.ObjectId;
  eventId: Types.ObjectId;
  seatNumbers: string[];
}
