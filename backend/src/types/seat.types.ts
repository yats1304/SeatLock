import { Document, Types } from "mongoose";

export interface ISeat extends Document {
  eventId: Types.ObjectId;
  seatNumber: string;
  status: "available" | "reserved" | "booked";
  reservedBy: Types.ObjectId;
  reservedUntil: Date;
  createdAt: Date;
  updatedAt: Date;
}
