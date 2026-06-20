import { Document, Types } from "mongoose";

export interface IEvent extends Document {
  name: string;
  venue: string;
  dateTime: Date;
  totalSeats: number;
  createdBy: Types.ObjectId;
}

export interface IUpdateEventBody {
  name?: string;
  venue?: string;
  dateTime?: Date;
  totalSeats?: number;
}

export interface IGetEventsQuery {
  page?: string;
  limit?: string;
  search?: string;
}
