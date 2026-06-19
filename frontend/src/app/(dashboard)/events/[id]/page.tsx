"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getEventById, getEventSeats } from "@/services/event.service";
import { reserveSeats } from "@/services/reservation.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SeatGrid from "@/components/event/SeatGrid";
import { useAppSelector } from "@/hooks/useRedux";
import toast from "react-hot-toast";
import { LoadingScreen } from "@/components/loading";
import {
  MapPin,
  Calendar,
  Users,
  Ticket,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/components/event/StatCard";

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuth } = useAppSelector((state) => state.auth);

  const [event, setEvent] = useState<any>(null);
  const [seats, setSeats] = useState<any[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [eventData, seatData] = await Promise.all([
        getEventById(id as string),
        getEventSeats(id as string),
      ]);
      setEvent(eventData.event);
      setSeats(seatData.seats);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to load event details.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSeat = (seatNumber: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber],
    );
  };

  const handleReserveSeats = async () => {
    if (!isAuth) {
      toast.error("Please log in first to reserve seats.");
      return;
    }
    if (selectedSeats.length === 0) return;

    try {
      setLoading(true);
      const res = await reserveSeats(id as string, selectedSeats);
      toast.success(res.message || "Seats reserved successfully!");
      setSelectedSeats([]);

      // Start countdown redirect
      const reservationId =
        res.reservation?._id ?? res._id ?? res.reservationId;
      setCountdown(3);
      setRedirecting(true);

      let count = 3;
      countdownRef.current = setInterval(() => {
        count -= 1;
        setCountdown(count);
        if (count <= 0) {
          clearInterval(countdownRef.current!);
          router.push(`/reservations/${reservationId}`);
        }
      }, 1000);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to reserve seats.");
    } finally {
      setLoading(false);
    }
  };

  const availableSeats = seats.filter((s) => s.status === "available").length;
  const reservedSeats = seats.filter((s) => s.status === "reserved").length;
  const bookedSeats = seats.filter((s) => s.status === "booked").length;

  if (loading) return <LoadingScreen />;

  if (error || !event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="rounded-full bg-destructive/10 p-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold">Error Loading Event</h2>
        <p className="text-muted-foreground max-w-md text-center">
          {error || "Event not found"}
        </p>
        <Link href="/events">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Button>
        </Link>
      </div>
    );
  }

  const eventDate = new Date(event.dateTime);
  const isPast = eventDate < new Date();

  return (
    <div className="space-y-10 pb-16">
      {/* Countdown redirect overlay */}
      {redirecting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-card p-10 shadow-2xl">
            {/* Animated ring */}
            <div className="relative flex items-center justify-center">
              <svg
                className="absolute"
                width="96"
                height="96"
                viewBox="0 0 96 96"
              >
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-muted/30"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${(countdown / 3) * 251.2} 251.2`}
                  className="text-foreground transition-all duration-1000"
                  style={{
                    transform: "rotate(-90deg)",
                    transformOrigin: "50% 50%",
                  }}
                />
              </svg>
              <span className="text-5xl font-bold tabular-nums">
                {countdown}
              </span>
            </div>
            <div className="text-center space-y-1">
              <p className="text-lg font-semibold">Seats Reserved!</p>
              <p className="text-sm text-muted-foreground">
                Redirecting to your reservation in {countdown} second
                {countdown !== 1 ? "s" : ""}…
              </p>
            </div>
            <CheckCircle2 className="h-6 w-6 text-green-500 animate-bounce" />
          </div>
        </div>
      )}
      {/* Hero header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/events"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ArrowLeft className="h-3 w-3" />
            Events
          </Link>
          <h1 className="text-4xl font-bold tracking-tight">{event.name}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 text-sm">
              <MapPin className="h-4 w-4" />
              {event.venue}
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm">
              <Calendar className="h-4 w-4" />
              {eventDate.toLocaleDateString("en-US", {
                weekday: "short",
                month: "long",
                day: "numeric",
              })}
              {" at "}
              {eventDate.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
        {/* Past event badge */}
        {isPast && (
          <span className="self-start rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Past Event
          </span>
        )}
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Ticket} label="Total Seats" value={event.totalSeats} />
        <StatCard
          icon={CheckCircle2}
          label="Available"
          value={availableSeats}
          highlight
        />
        <StatCard icon={Users} label="Reserved" value={reservedSeats} />
        <StatCard icon={Ticket} label="Booked" value={bookedSeats} />
      </div>

      {/* Seat map */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Select Your Seats</h2>
        <SeatGrid
          seats={seats}
          selectedSeats={selectedSeats}
          toggleSeat={toggleSeat}
        />
      </div>

      {/* Reservation panel */}
      <Card className="border border-border">
        <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Selected Seats</p>
            <p className="text-lg font-semibold">
              {selectedSeats.length > 0
                ? selectedSeats.join(", ")
                : "No seats selected"}
            </p>
          </div>
          <Button
            size="lg"
            disabled={selectedSeats.length === 0 || loading}
            onClick={handleReserveSeats}
            className="gap-2 group"
          >
            <Ticket className="h-4 w-4 transition-transform group-hover:scale-110" />
            Reserve {selectedSeats.length > 0 && `(${selectedSeats.length})`}
          </Button>
        </CardContent>
      </Card>

      {/* Overlay when not authenticated */}
      {!isAuth && (
        <div className="rounded-xl border border-dashed border-border p-6 text-center">
          <p className="text-muted-foreground">
            You need to{" "}
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-foreground"
            >
              log in
            </Link>{" "}
            to reserve seats.
          </p>
        </div>
      )}
    </div>
  );
}
