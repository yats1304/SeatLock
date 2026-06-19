"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Calendar, Ticket, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  eventName: string;
  seatNumbers: string[];
  isLoading?: boolean;
}

export default function ConfirmBookingModal({
  isOpen,
  onClose,
  onConfirm,
  eventName,
  seatNumbers,
  isLoading = false,
}: ConfirmBookingModalProps) {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={isLoading ? undefined : onClose}
      />

      {/* Modal Dialog Content */}
      <div
        className={cn(
          "relative w-full max-w-md overflow-hidden rounded-xl border border-border bg-card p-6 shadow-2xl transition-all",
          "animate-in fade-in zoom-in-95 duration-200"
        )}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        {/* Header */}
        <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-6">
          <h2 className="text-xl font-bold tracking-tight">Confirm Booking</h2>
          <p className="text-sm text-muted-foreground">
            Please review the details below to complete your ticket reservation.
          </p>
        </div>

        {/* Details Card */}
        <div className="space-y-4 rounded-lg bg-muted/40 p-4 border border-border/50 mb-6">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              Event Details
            </span>
            <div className="flex items-start gap-2.5 mt-1">
              <Calendar className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="font-semibold text-sm leading-tight text-foreground">
                {eventName}
              </p>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-border/50">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              Selected Seats
            </span>
            <div className="flex items-center gap-2 mt-1">
              <Ticket className="h-4 w-4 text-primary shrink-0" />
              <div className="flex flex-wrap gap-1">
                {seatNumbers.map((seat) => (
                  <span
                    key={seat}
                    className="text-xs font-semibold rounded-md border border-border/80 px-2 py-0.5 bg-background shadow-xs"
                  >
                    {seat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Warning text */}
        <p className="text-xs text-muted-foreground text-center mb-6">
          Confirming this booking will finalize your seat reservations permanently.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="sm:w-auto w-full"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="sm:w-auto w-full gap-2 font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Confirming...
              </>
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
