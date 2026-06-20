import express from "express";
import * as eventController from "../controllers/event.controller.js";
import { isAuth } from "../middlewares/isAuth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createEventSchema,
  getEventsSchema,
  updateEventSchema,
} from "../validators/event.validator.js";

const router = express.Router();

router.get("/", validate(getEventsSchema, "query"), eventController.getEvents);
router.get("/kpis", eventController.getEventKPIs);
router.get("/:eventId/seats", eventController.getEventSeats);
router.get("/my-events", isAuth, eventController.getMyEvents);
router.get("/:id/attendees", isAuth, eventController.getEventAttendees);
router.get("/:id", eventController.getEventById);
router.post(
  "/create",
  validate(createEventSchema),
  isAuth,
  eventController.createEvent,
);
router.patch(
  "/:id",
  isAuth,
  validate(updateEventSchema),
  eventController.updateEvent,
);
router.delete("/:id", isAuth, eventController.deleteEvent);

export default router;
