import express from "express";
import { isAuth } from "../middlewares/isAuth.middleware.js";
import {
  confirmBooking,
  getMyBookings,
} from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/:reservationId", isAuth, confirmBooking);
router.get("/my", isAuth, getMyBookings);

export default router;
