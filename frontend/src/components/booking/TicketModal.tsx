"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Booking } from "@/types/booking";
import { useAppSelector } from "@/hooks/useRedux";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock, Ticket, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
}

export function TicketModal({ isOpen, onClose, booking }: TicketModalProps) {
  const { user } = useAppSelector((state) => state.auth);
  const [copied, setCopied] = useState(false);

  if (!booking) return null;

  const eventDate = new Date(booking.eventId.dateTime);

  const handleCopyRef = () => {
    navigator.clipboard.writeText(booking._id);
    setCopied(true);
    toast.success("Booking Reference ID copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Your Event Ticket"
      description="Present this ticket pass at the venue entrance."
      className="max-w-sm"
    >
      {/* Ticket Pass Container */}
      <div className="flex flex-col border border-border rounded-xl bg-card overflow-hidden shadow-md">
        {/* Ticket Header */}
        <div className="p-3 bg-muted/40 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-1.5">
            <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
              <Ticket className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold tracking-wider text-xs">SEATLOCK</span>
          </div>
          <div className="rounded-full bg-green-500/10 border border-green-500/30 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-green-500">
            Admit One
          </div>
        </div>

        {/* Ticket Info Section */}
        <div className="p-4 space-y-3">
          <div>
            <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">
              Event
            </span>
            <h3 className="text-base font-bold leading-tight text-foreground mt-0.5">
              {booking.eventId.name}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">
                Date & Time
              </span>
              <div className="flex items-center gap-1 mt-0.5 text-foreground">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="font-medium">
                  {eventDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-0.5 text-muted-foreground text-[10px] pl-4.5">
                <Clock className="h-3 w-3 shrink-0" />
                <span>
                  {eventDate.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">
                Venue
              </span>
              <div className="flex items-start gap-1 mt-0.5 text-foreground">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <span className="font-medium line-clamp-2 leading-tight">
                  {booking.eventId.venue}
                </span>
              </div>
            </div>
          </div>

          {/* Seat Badges */}
          <div>
            <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">
              Seats Booked
            </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {booking.seatNumbers.map((seat) => (
                <span
                  key={seat}
                  className="text-[10px] font-bold rounded border border-primary/20 bg-primary/5 text-primary px-2.5 py-0.5 shadow-sm"
                >
                  {seat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Perforated Divider */}
        <div className="relative flex items-center justify-center">
          {/* Left Inset Cutout */}
          <div className="absolute -left-3.25 h-6 w-6 rounded-full bg-background border-r border-border" />
          {/* Dashed Line */}
          <div className="w-full border-t border-dashed border-border" />
          {/* Right Inset Cutout */}
          <div className="absolute -right-3.25 h-6 w-6 rounded-full bg-background border-l border-border" />
        </div>

        {/* Ticket Stub (QR Code & Holder) */}
        <div className="p-4 bg-muted/20 flex flex-col items-center gap-4 text-center">
          {/* Mock QR Code in high contrast card */}
          <div className="p-2.5 bg-white border border-slate-200 rounded-lg shadow-inner">
            <svg
              className="w-20 h-20 text-slate-900"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              {/* Top Left Corner Anchor */}
              <rect x="0" y="0" width="24" height="24" />
              <rect x="4" y="4" width="16" height="16" fill="white" />
              <rect x="8" y="8" width="8" height="8" />

              {/* Top Right Corner Anchor */}
              <rect x="76" y="0" width="24" height="24" />
              <rect x="80" y="4" width="16" height="16" fill="white" />
              <rect x="84" y="8" width="8" height="8" />

              {/* Bottom Left Corner Anchor */}
              <rect x="0" y="76" width="24" height="24" />
              <rect x="4" y="80" width="16" height="16" fill="white" />
              <rect x="8" y="84" width="8" height="8" />

              {/* Simulated QR Code pixels */}
              <rect x="32" y="4" width="8" height="4" />
              <rect x="44" y="0" width="12" height="4" />
              <rect x="60" y="8" width="8" height="8" />
              <rect x="36" y="20" width="8" height="8" />
              <rect x="48" y="16" width="8" height="20" />
              <rect x="64" y="24" width="20" height="4" />
              <rect x="32" y="36" width="12" height="4" />
              <rect x="56" y="40" width="12" height="8" />
              <rect x="76" y="36" width="8" height="4" />

              <rect x="8" y="32" width="4" height="16" />
              <rect x="16" y="56" width="12" height="4" />

              <rect x="12" y="64" width="4" height="4" />
              <rect x="36" y="60" width="8" height="16" />
              <rect x="48" y="76" width="16" height="4" />
              <rect x="36" y="84" width="16" height="8" />

              <rect x="84" y="32" width="12" height="4" />
              <rect x="76" y="56" width="4" height="12" />
              <rect x="84" y="60" width="12" height="4" />
              <rect x="68" y="76" width="4" height="20" />
              <rect x="84" y="84" width="16" height="4" />
            </svg>
          </div>

          {/* Holder Details */}
          <div className="space-y-0.5">
            <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">
              Ticket Holder
            </span>
            <p className="font-semibold text-xs text-foreground">
              {user?.name || "Attendee"}
            </p>
            <p className="text-[10px] text-muted-foreground leading-none">
              {user?.email}
            </p>
          </div>

          {/* Reference ID Footer */}
          <div className="w-full pt-2.5 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1 font-mono">
              <span className="text-[9px] text-muted-foreground/60">REF:</span>
              <span className="font-semibold select-all text-[10px] truncate max-w-31.25">
                {booking._id}
              </span>
            </div>
            <button
              onClick={handleCopyRef}
              className="p-1 rounded hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              title="Copy Reference ID"
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Done Action Button */}
      <div className="mt-4">
        <Button className="w-full h-9 text-xs font-semibold" onClick={onClose}>
          Done
        </Button>
      </div>
    </Modal>
  );
}
