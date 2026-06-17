import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { IUser } from "../types/auth.types.js";
import ErrorHandler from "../utils/errorHandler.js";
import { generateJWT } from "../utils/generateJWT.js";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ErrorHandler(400, "User already exist!");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = generateJWT(user._id.toString());

  return { user, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ErrorHandler(400, "Invalid user!");
  }

  const comparedPassword = await bcrypt.compare(password, user.password);

  if (!comparedPassword) {
    throw new ErrorHandler(400, "Invalid credentials!");
  }

  const token = generateJWT(user._id.toString());

  return { user, token };
};

export const currentUser = async (id: string) => {
  const user = await User.findById(id).select("-password");

  if (!user) {
    throw new ErrorHandler(404, "User not found!");
  }

  return user;
};

export const changePassword = async (
  id: string,
  currentPassword: string,
  newPassword: string,
) => {
  const user = await User.findById(id).select("+password");

  if (!user) {
    throw new ErrorHandler(404, "User not found!");
  }

  const isPasswordMatched = await bcrypt.compare(
    currentPassword,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new ErrorHandler(400, "Current password not matched!");
  }

  if (currentPassword === newPassword) {
    throw new ErrorHandler(
      400,
      "New password must be different from current password",
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;

  await user.save();

  return true;
};
