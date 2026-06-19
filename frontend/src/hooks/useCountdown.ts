"use client";

import { useEffect, useState } from "react";

export const useCountdown = (expiredAt: string) => {
  const calculate = () => {
    const diff = new Date(expiredAt).getTime() - Date.now();

    if (diff <= 0) {
      return "Expired";
    }

    const minutes = Math.floor(diff / 1000 / 60);

    const seconds = Math.floor((diff / 1000) % 60);

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const [timeLeft, setTimeLeft] = useState(calculate());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculate());
    }, 1000);

    return () => clearInterval(interval);
  }, [expiredAt]);

  return timeLeft;
};
