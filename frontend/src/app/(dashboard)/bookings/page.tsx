"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { myBookings } from "@/services/booking.service";
import { Booking } from "@/types/booking";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Calendar,
  Users,
  CheckCircle2,
  CalendarOff,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Pagination } from "@/components/ui/Pagination";

const LIMIT = 9;


export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);

  useEffect(() => {
    fetchBookings(page);
  }, [page]);

  const fetchBookings = async (p: number) => {
    try {
      setLoading(true);
      const res = await myBookings(p, LIMIT);
      setBookings(res.bookings ?? []);
      // Support common pagination response shapes
      setTotalPages(res.totalPages ?? res.pagination?.totalPages ?? 1);
      setTotalBookings(res.total ?? res.pagination?.total ?? res.bookings?.length ?? 0);
    } catch {
      toast.error("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">My Bookings</h1>
          <p className="mt-1 text-muted-foreground">
            All your confirmed seat bookings in one place.
          </p>
        </div>
        {!loading && totalBookings > 0 && (
          <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            {totalBookings} booking{totalBookings > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(LIMIT)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border p-6 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2 flex-wrap">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-12" />
              </div>
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && bookings.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
          <CalendarOff className="mb-4 h-12 w-12 text-muted-foreground/60" />
          <h3 className="text-xl font-semibold">No bookings yet</h3>
          <p className="mt-1 text-muted-foreground max-w-sm">
            You haven't confirmed any bookings yet. Reserve seats and confirm
            them before they expire.
          </p>
          <Link href="/events" className="mt-6">
            <Button variant="outline" className="gap-2">
              Browse Events
            </Button>
          </Link>
        </div>
      )}

      {/* Bookings grid */}
      {!loading && bookings.length > 0 && (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => {
              const eventDate = new Date(booking.eventId.dateTime);
              const bookedAt = new Date(booking.bookedAt);

              return (
                <Card
                  key={booking._id}
                  className="group relative overflow-hidden transition-all duration-300 border border-border bg-card hover:-translate-y-1 hover:shadow-lg hover:border-foreground"
                >
                  {/* Confirmed ribbon */}
                  <div className="absolute top-0 right-0 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-bl-lg bg-green-500/15 text-green-500">
                    Confirmed
                  </div>

                  <CardContent className="p-6 flex flex-col gap-4">
                    {/* Event title & venue */}
                    <div className="space-y-1 pr-16">
                      <h3 className="text-lg font-semibold leading-tight line-clamp-1 group-hover:text-foreground transition-colors">
                        {booking.eventId.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{booking.eventId.venue}</span>
                      </div>
                    </div>

                    {/* Event date & seat count */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {eventDate.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
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
                          {booking.seatNumbers.length} seat
                          {booking.seatNumbers.length > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    {/* Seat badges */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1.5">Seats</p>
                      <div className="flex flex-wrap gap-1.5">
                        {booking.seatNumbers.slice(0, 8).map((seat: string) => (
                          <span
                            key={seat}
                            className="text-xs font-medium rounded-md border border-border px-2 py-0.5 bg-background"
                          >
                            {seat}
                          </span>
                        ))}
                        {booking.seatNumbers.length > 8 && (
                          <span className="text-xs font-medium rounded-md border border-border px-2 py-0.5 bg-background text-muted-foreground">
                            +{booking.seatNumbers.length - 8} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Booked at */}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground border-t border-border pt-3 mt-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>
                        Booked on{" "}
                        {bookedAt.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        at{" "}
                        {bookedAt.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </CardContent>

                  {/* Hover shine */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-linear-to-r from-transparent via-foreground/5 to-transparent pointer-events-none" />
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </>
      )}
    </div>
  );
}
