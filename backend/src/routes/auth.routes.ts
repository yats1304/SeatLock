import express from "express";
import { validate } from "../middlewares/validate.middleware.js";
import {
  ChangePasswordSchema,
  LoginSchema,
  registerSchema,
} from "../validators/auth.validator.js";
import {
  changePassword,
  login,
  logout,
  me,
  register,
} from "../controllers/auth.controller.js";
import { isAuth } from "../middlewares/isAuth.middleware.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(LoginSchema), login);
router.post("/logout", isAuth, logout);
router.post(
  "/change-password",
  isAuth,
  validate(ChangePasswordSchema),
  changePassword,
);
router.get("/me", isAuth, me);

export default router;
