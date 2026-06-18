import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { startCronJobs } from "./jobs/cron.js";

const PORT = process.env.PORT || 5000;

await connectDB();

startCronJobs();

app.listen(PORT, () => {
  console.log(`Sever running on http://localhost:5000`);
});
