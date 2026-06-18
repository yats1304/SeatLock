import express from "express";
import { isAuth } from "../middlewares/isAuth.middleware.js";
import { confirmBooking } from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/:reservationId", isAuth, confirmBooking);

export default router;
