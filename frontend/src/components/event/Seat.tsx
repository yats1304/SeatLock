import { cn } from "@/lib/utils";

interface SeatProps {
  seatNumber: string;
  status: string; // "available" | "booked" | "reserved"
  selected: boolean;
  onClick: () => void;
}

export default function Seat({
  seatNumber,
  status,
  selected,
  onClick,
}: SeatProps) {
  const isDisabled = status !== "available";
  const isBooked = status === "booked";
  const isReserved = status === "reserved";

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onClick}
      className={cn(
        "relative h-12 w-12 rounded-lg text-xs font-semibold transition-all duration-200 select-none",
        "border border-dashed border-border bg-background text-muted-foreground",
        "hover:border-foreground hover:text-foreground hover:shadow-sm",
        selected && [
          "bg-foreground  dark:text-black hover:text-white border-foreground shadow-lg scale-105",
          "hover:bg-foreground/90",
        ],
        isReserved &&
          !selected && [
            "bg-amber-500/15 text-amber-600 border-amber-400/50 cursor-not-allowed",
            "dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/40",
            "hover:bg-amber-500/15 hover:border-amber-400/50",
          ],

        isBooked &&
          !selected && [
            "bg-rose-500/15 text-rose-500 border-rose-400/40 cursor-not-allowed",
            "dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/40",
            "hover:bg-rose-500/15 hover:border-rose-400/40",
          ],

        isDisabled &&
          !isReserved &&
          !isBooked &&
          "opacity-50 cursor-not-allowed",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      )}
      aria-label={`Seat ${seatNumber} - ${status}`}
    >
      <span className="relative z-10">{seatNumber}</span>

      {/* Lock icon for booked seats */}
      {isBooked && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg
            className="h-5 w-5 text-rose-400/60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </span>
      )}
    </button>
  );
}
