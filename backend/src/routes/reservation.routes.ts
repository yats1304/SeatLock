import express from "express";
import { isAuth } from "../middlewares/isAuth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createReservationSchema } from "../validators/reservation.validate.js";
import {
  getMyReservations,
  reserveSeats,
  getReservationById,
} from "../controllers/reservation.controller.js";

const router = express.Router();

router.post(
  "/create/:eventId",
  isAuth,
  validate(createReservationSchema),
  reserveSeats,
);
router.get("/my", isAuth, getMyReservations);
router.get("/:reservationId", isAuth, getReservationById);

export default router;
