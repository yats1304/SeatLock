"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ReservationCard from "@/components/reservations/ReservationCard";
import ConfirmBookingModal from "@/components/reservations/ConfirmBookingModal";
import { getMyReservations } from "@/services/reservation.service";
import { confirmBooking } from "@/services/booking.service";
import { Reservation } from "@/types/reservation";
import { CalendarOff, Ticket } from "lucide-react";
import Link from "next/link";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeReservation, setActiveReservation] =
    useState<Reservation | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const fetchReservations = async () => {
    try {
      const data = await getMyReservations();
      setReservations(data.reservations);
    } catch (error) {
      toast.error("Failed to load reservations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleConfirmBooking = async () => {
    if (!activeReservation) return;
    try {
      setIsConfirming(true);
      const response = await confirmBooking(activeReservation._id);
      toast.success(response.message);
      setActiveReservation(null);
      await fetchReservations();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
      setIsConfirming(false);
    }
  };

  const pendingCount = reservations.filter(
    (r) => new Date(r.expiredAt) > new Date(),
  ).length;

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">My Reservations</h1>
          <p className="mt-1 text-muted-foreground">
            Confirm your bookings before they expire.
          </p>
        </div>
        {!loading && pendingCount > 0 && (
          <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium">
            <Ticket className="h-4 w-4 text-muted-foreground" />
            {pendingCount} pending reservation{pendingCount > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border p-6 space-y-4"
            >
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && reservations.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <CalendarOff className="mb-4 h-12 w-12 text-muted-foreground/60" />
          <h3 className="text-xl font-semibold">No reservations yet</h3>
          <p className="mt-1 text-muted-foreground max-w-sm">
            You haven’t made any reservations. Browse events and secure your
            seats.
          </p>
          <Link href="/events" className="mt-6">
            <Button variant="outline" className="gap-2">
              Browse Events
            </Button>
          </Link>
        </div>
      )}

      {/* Reservation cards grid */}
      {!loading && reservations.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {reservations.map((reservation) => (
            <ReservationCard
              key={reservation._id}
              reservation={reservation}
              onConfirm={(res) => setActiveReservation(res)}
            />
          ))}
        </div>
      )}

      {/* Confirm Booking Modal */}
      {activeReservation && (
        <ConfirmBookingModal
          isOpen={!!activeReservation}
          onClose={() => setActiveReservation(null)}
          onConfirm={handleConfirmBooking}
          eventName={activeReservation.eventId.name}
          seatNumbers={activeReservation.seatNumbers}
          isLoading={isConfirming}
        />
      )}
    </div>
  );
}
