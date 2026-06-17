import { TryCatch } from "../utils/tryCatch.js";
import * as eventService from "../services/event.service.js";

export const createEvent = TryCatch(async (req, res) => {
  const event = await eventService.createEvent(req.body);

  res.status(201).json({
    message: "Event created successfully",
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
