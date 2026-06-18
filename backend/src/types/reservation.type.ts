import { Document, Types } from "mongoose";

export interface IReservation extends Document {
  userId: Types.ObjectId;
  eventId: Types.ObjectId;
  seatNumbers: string[];
  expiredAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateReservation extends Document {
  eventId: string;
  seatNumbers: string[];
}
