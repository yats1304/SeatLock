import { TryCatch } from "../utils/tryCatch.js";
import * as eventService from "../services/event.service.js";
import ErrorHandler from "../utils/errorHandler.js";

export const createEvent = TryCatch(async (req, res) => {
  const createdBy = req.user?._id;

  const event = await eventService.createEvent({
    ...req.body,
    createdBy,
  });

  res.status(201).json({
    message: "Event created successfully",
    createdBy,
    event,
  });
});

export const getEvents = TryCatch(async (req, res) => {
  const page = Number(req.query.page) || 1;

  const limit = Number(req.query.limit) || 10;

  const search = req.query.search as string;

  const data = await eventService.getEvents(page, limit, search);

  res.json({
    message: "Fetch all events successfully!",
    ...data,
  });
});

export const getEventById = TryCatch(async (req, res) => {
  const event = await eventService.getEventById(req.params.id as string);

  res.json({
    message: `${event.event.name} fetched successfully`,
    ...event,
  });
});

export const getEventKPIs = TryCatch(async (req, res) => {
  const kpis = await eventService.getEventsKPIs();

  res.json({
    message: "Event KPI fetched successfully",
    data: kpis,
  });
});

export const updateEvent = TryCatch(async (req, res) => {
  const event = await eventService.updateEvent(
    req.params.id as string,
    req.body,
  );

  res.json({
    message: "Event update successfully",
    event,
  });
});

export const deleteEvent = TryCatch(async (req, res) => {
  await eventService.deleteEvent(req.params.id as string);

  res.json({
    message: "Event deleted successfully",
  });
});

export const getEventSeats = TryCatch(async (req, res) => {
  const eventId = req.params.eventId as string;

  const seats = await eventService.getEventSeats(eventId);

  res.json({
    message: "Get event seats",
    seats,
  });
});

export const getMyEvents = TryCatch(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ErrorHandler(404, "User is not found!");
  }

  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const search = req.query.search as string;

  const { events, total, totalPages, currentPage } =
    await eventService.getMyEvents(userId.toString(), page, search);

  res.json({
    message: "My events fetch successfully!",
    events,
    pagination: {
      total,
      totalPages,
      currentPage,
      perPage: 9,
    },
  });
});

export const getEventAttendees = TryCatch(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ErrorHandler(401, "Please login first!");
  }

  const attendees = await eventService.getEventAttendees(
    req.params.id as string,
    userId.toString(),
  );

  res.json({
    message: "Event attendees fetched successfully",
    attendees,
  });
});
