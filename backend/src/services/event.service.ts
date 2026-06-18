import { Event } from "../models/event.model.js";
import { Seat } from "../models/seat.model.js";
import { IEvent } from "../types/event.types.js";
import ErrorHandler from "../utils/errorHandler.js";

export const createEvent = async (payload: IEvent) => {
  const event = await Event.create(payload);

  const seats = Array.from({ length: payload.totalSeats }, (_, index) => ({
    eventId: event._id,
    seatNumber: `A${index + 1}`,
  }));
  await Seat.insertMany(seats);

  return event;
};

export const getEvents = async (
  page: number,
  limit: number,
  search?: string,
) => {
  const query = search
    ? {
        name: {
          $regex: search,
          $options: "i",
        },
      }
    : {};

  const skip = (page - 1) * limit;

  const [events, total] = await Promise.all([
    Event.find(query).sort({ dateTime: 1 }).skip(skip).limit(limit),

    Event.countDocuments(query),
  ]);

  return {
    events,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getEventById = async (eventId: string) => {
  const event = await Event.findById(eventId);

  if (!event) {
    throw new ErrorHandler(404, "Event not found!");
  }

  const [availableSeats, reservedSeats, bookedSeats] = await Promise.all([
    Seat.countDocuments({
      eventId,
      status: "available",
    }),

    Seat.countDocuments({
      eventId,
      status: "reserved",
    }),

    Seat.countDocuments({
      eventId,
      status: "booked",
    }),
  ]);

  return {
    event,
    stats: {
      totalSeats: event.totalSeats,
      availableSeats,
      reservedSeats,
      bookedSeats,
    },
  };
};

export const getEventsKPIs = async () => {
  const now = new Date();

  const [totalEvents, upcomingEvents, CompletedEvents] = await Promise.all([
    Event.countDocuments(),

    Event.countDocuments({
      dateTime: { $gt: now },
    }),

    Event.countDocuments({
      dateTime: { $lt: now },
    }),
  ]);

  return {
    totalEvents,
    upcomingEvents,
    CompletedEvents,
  };
};

export const updateEvent = async (eventId: string, payload: any) => {
  const event = await Event.findByIdAndUpdate(eventId, payload, { new: true });

  if (!event) {
    throw new ErrorHandler(404, "Event not found!");
  }

  return event;
};

export const deleteEvent = async (eventId: string) => {
  const event = await Event.findByIdAndUpdate(eventId);

  if (!event) {
    throw new ErrorHandler(404, "Event not found!");
  }

  await Seat.deleteMany({
    eventId,
  });

  return event;
};

export const getEventSeats = async (eventId: string) => {
  const event = await Event.findById(eventId);

  if (!event) {
    throw new ErrorHandler(404, "Event not found!");
  }

  const seats = await Seat.find({
    eventId,
  })
    .select("seatNumber status reservedUntil")
    .sort({
      seatNumber: 1,
    });

  return seats;
};
