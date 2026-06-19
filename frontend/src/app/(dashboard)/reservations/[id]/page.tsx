"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getReservationById } from "@/services/reservation.service";
import ReservationCard from "@/components/reservations/ReservationCard";
import { LoadingScreen } from "@/components/loading";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  CalendarCheck,
} from "lucide-react";
import Link from "next/link";
import { Reservation } from "@/types/reservation";
import toast from "react-hot-toast";
import { confirmBooking } from "@/services/booking.service";

export default function ReservationDetailPage() {
  const { id } = useParams();

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (id) fetchReservation();
  }, [id]);

  const fetchReservation = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getReservationById(id as string);
      setReservation(res.reservation);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Failed to load reservation details.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (r: Reservation) => {
    try {
      setConfirming(true);
      const res = await confirmBooking(r._id);
      toast.success(res.message || "Booking confirmed successfully!");
      setConfirmed(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to confirm booking.");
    } finally {
      setConfirming(false);
    }
  };

  if (loading) return <LoadingScreen />;

  if (error || !reservation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="rounded-full bg-destructive/10 p-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold">Error Loading Reservation</h2>
        <p className="text-muted-foreground max-w-md text-center">
          {error || "Reservation not found"}
        </p>
        <Link href="/reservations">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Reservations
          </Button>
        </Link>
      </div>
    );
  }

  if (confirmed) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-6 rounded-2xl border border-border bg-card p-12 text-center shadow-sm max-w-md w-full">
          <div className="rounded-full bg-green-500/10 p-5">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Booking Confirmed!
            </h2>
            <p className="text-sm text-muted-foreground">
              Your seats have been booked successfully. See you at the event!
            </p>
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            <Link href="/reservations">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                My Reservations
              </Button>
            </Link>
            <Link href="/events">
              <Button className="gap-2">
                <CalendarCheck className="h-4 w-4" />
                Browse Events
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="space-y-8 pb-16 max-w-xl w-full">
        {/* Header */}
        <div>
          <h1 className="text-3xl text-center font-bold tracking-tight">
            Reservation Details
          </h1>
          <p className="text-muted-foreground text-center text-sm mt-1">
            Review your reservation and confirm your booking before time runs
            out.
          </p>
        </div>

        <ReservationCard
          reservation={reservation}
          onConfirm={handleConfirm}
          confirming={confirming}
        />
      </div>
    </div>
  );
}
