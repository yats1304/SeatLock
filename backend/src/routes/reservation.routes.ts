import express from "express";
import { isAuth } from "../middlewares/isAuth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createReservationSchema } from "../validators/reservation.validate.js";
import { reserveSeats } from "../controllers/reservation.controller.js";

const router = express.Router();

router.post("/create/:eventId", isAuth, validate(createReservationSchema), reserveSeats);

export default router;
