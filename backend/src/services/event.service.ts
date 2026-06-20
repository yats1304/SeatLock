import { Event } from "../models/event.model.js";
import { Seat } from "../models/seat.model.js";
import { Booking } from "../models/booking.model.js";
import { Reservation } from "../models/reservation.model.js";
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
  const event = await Event.findByIdAndDelete(eventId);

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

export const getMyEvents = async (
  userId: string,
  page: number,
  search?: string,
) => {
  const limit = 9;
  const skip = (page - 1) * limit;

  const baseQuery: any = { createdBy: userId };

  if (search) {
    baseQuery.name = {
      $regex: search,
      $options: "i",
    };
  }

  const [events, total] = await Promise.all([
    Event.find(baseQuery)
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean(),
    Event.countDocuments(baseQuery),
  ]);

  return {
    events,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
};

export const getEventAttendees = async (eventId: string, userId: string) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ErrorHandler(404, "Event not found!");
  }

  if (event.createdBy.toString() !== userId) {
    throw new ErrorHandler(
      403,
      "You are not authorized to view this event's attendees.",
    );
  }

  const [bookings, reservations] = await Promise.all([
    Booking.find({ eventId }).populate("userId", "name email").lean(),
    Reservation.find({ eventId, expiredAt: { $gt: new Date() } })
      .populate("userId", "name email")
      .lean(),
  ]);

  const attendees: any[] = [];

  bookings.forEach((b: any) => {
    attendees.push({
      id: b._id,
      user: b.userId,
      seatNumbers: b.seatNumbers,
      status: "booked",
      date: b.createdAt || b.bookedAt,
    });
  });

  reservations.forEach((r: any) => {
    attendees.push({
      id: r._id,
      user: r.userId,
      seatNumbers: r.seatNumbers,
      status: "reserved",
      date: r.expiredAt,
    });
  });

  return attendees;
};
