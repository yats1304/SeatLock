import { User } from "../models/user.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "../utils/tryCatch.js";
import jwt from "jsonwebtoken";

export const isAuth = TryCatch(async (req, res, next) => {
  const token = req.cookies.jwtToken;

  const decodedData = jwt.verify(token, process.env.JWT_SECRET as string) as {
    id: string;
  };

  if (!decodedData) {
    throw new ErrorHandler(400, "Token is expired!");
  }

  const user = await User.findById(decodedData.id).select("-password");

  if (!user) {
    throw new ErrorHandler(400, "No user with id");
  }

  req.user = user;

  return next();
});
