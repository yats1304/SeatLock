"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Calendar,
  Users,
  Timer,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Reservation } from "@/types/reservation";
import { useCountdown } from "@/hooks/useCountdown";

interface Props {
  reservation: Reservation;
  onConfirm: (reservation: Reservation) => void;
  confirming?: boolean;
}

export default function ReservationCard({ reservation, onConfirm, confirming = false }: Props) {
  const countdown = useCountdown(reservation.expiredAt);
  const isExpired = countdown === "Expired";
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setPulse(true);
    const timeout = setTimeout(() => setPulse(false), 300);
    return () => clearTimeout(timeout);
  }, [countdown]);

  const eventDate = new Date(reservation.eventId.dateTime);

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300",
        "border border-border bg-card",
        "hover:-translate-y-1 hover:shadow-lg hover:border-foreground",
        isExpired && "opacity-60 hover:opacity-80",
      )}
    >
      {/* Status ribbon */}
      <div
        className={cn(
          "absolute top-0 right-0 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-bl-lg",
          isExpired
            ? "bg-muted text-muted-foreground"
            : "bg-foreground text-background",
        )}
      >
        {isExpired ? "Expired" : "Pending"}
      </div>

      <CardContent className="p-6 flex flex-col gap-5">
        {/* Event title & venue */}
        <div className="space-y-1">
          <h3 className="text-lg font-semibold leading-tight line-clamp-2 group-hover:text-foreground transition-colors">
            {reservation.eventId.name}
          </h3>
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{reservation.eventId.venue}</span>
          </div>
        </div>

        {/* Details row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>
              {eventDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
              {" • "}
              {eventDate.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>
              {reservation.seatNumbers.length} seat
              {reservation.seatNumbers.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Seats list */}
        <div>
          <p className="text-xs text-muted-foreground mb-1.5">Seats</p>
          <div className="flex flex-wrap gap-1.5">
            {reservation.seatNumbers.map((seat: string) => (
              <span
                key={seat}
                className="text-xs font-medium rounded-md border border-border px-2 py-0.5 bg-background"
              >
                {seat}
              </span>
            ))}
          </div>
        </div>

        {/* Countdown timer */}
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 bg-background transition-all",
              pulse && "scale-105",
              isExpired && "border-muted-foreground/30 text-muted-foreground",
            )}
          >
            {isExpired ? (
              <AlertTriangle className="h-4 w-4" />
            ) : (
              <Timer className="h-4 w-4" />
            )}
            <span
              className={cn(
                "text-sm font-semibold tabular-nums",
                !isExpired && "text-foreground",
              )}
            >
              {isExpired ? "Expired" : countdown}
            </span>
          </div>
        </div>

        {/* Action button */}
        <Button
          disabled={isExpired || confirming}
          onClick={() => onConfirm(reservation)}
          className={cn(
            "w-full gap-2 transition-all group/btn",
            isExpired || confirming
              ? "cursor-not-allowed"
              : "hover:bg-foreground hover:text-background hover:border-foreground",
          )}
          variant={isExpired ? "outline" : "default"}
        >
          <CheckCircle2 className={cn("h-4 w-4 transition-transform", !confirming && "group-hover/btn:scale-110", confirming && "animate-spin")} />
          {isExpired ? "Expired" : confirming ? "Confirming…" : "Confirm Booking"}
        </Button>
      </CardContent>

      {/* Subtle hover shine */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-linear-to-r from-transparent via-foreground/5 to-transparent pointer-events-none" />
    </Card>
  );
}
