import { TryCatch } from "../utils/tryCatch.js";
import * as authService from "../services/auth.service.js";
import ErrorHandler from "../utils/errorHandler.js";

export const register = TryCatch(async (req, res) => {
  const { name, email, password } = req.body;

  const data = await authService.registerUser(name, email, password);

  res.cookie("jwtToken", data.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    message: "User registered successfully!",
    user: { name: data.user.name, email: data.user.email },
    token: data.token,
  });
});

export const login = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  const data = await authService.loginUser(email, password);

  res.cookie("jwtToken", data.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    message: "User login successfully!",
    user: { name: data.user.name, email: data.user.email },
    token: data.token,
  });
});

export const logout = TryCatch(async (req, res) => {
  res.clearCookie("jwtToken", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.json({
    message: "Logged out successfully!",
  });
});

export const me = TryCatch(async (req, res) => {
  if (!req.user) {
    throw new ErrorHandler(401, "Please login first!");
  }
  const userId = req.user._id.toString();

  const data = await authService.currentUser(userId);

  res.json({
    message: "User fetched successfully!",
    data,
  });
});

export const changePassword = TryCatch(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!req.user) {
    throw new ErrorHandler(401, "Please login first!");
  }
  const userId = req.user._id.toString();

  await authService.changePassword(userId, currentPassword, newPassword);

  res.status(200).json({
    message: "Password changed successfully!",
  });
});
