import cron from "node-cron";
import { releaseExpiredReservations } from "./releaseExpiredReservations.js";

export const startCronJobs = () => {
  cron.schedule("* * * * *", async () => {
    try {
      await releaseExpiredReservations();
    } catch (error) {
      console.error("[Reservation cleanup error]", error);
    }
  });
};
