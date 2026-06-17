import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

// routes
app.use("/api/auth", authRoutes);

app.use("/", (req: Request, res: Response) => {
  res.json({
    message: "SeatLock API is running",
  });
});

export default app;
