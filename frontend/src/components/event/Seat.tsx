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
        "group relative h-10 w-10 text-[10px] font-bold transition-all duration-200 select-none",
        "rounded-t-xl rounded-b-md border flex flex-col items-center justify-center p-0.5",
        // Available State
        status === "available" && [
          "border-border bg-background text-muted-foreground",
          "hover:border-foreground/85 hover:text-foreground hover:scale-105 hover:shadow-md",
        ],
        // Selected State
        selected && [
          "bg-foreground text-background border-foreground dark:text-background dark:border-foreground scale-105 shadow-md",
          "hover:bg-foreground/90",
        ],
        // Reserved State
        isReserved && !selected && [
          "bg-amber-500/10 text-amber-600 border-amber-500/30 cursor-not-allowed",
          "dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/40",
        ],
        // Booked State
        isBooked && !selected && [
          "bg-rose-500/10 text-rose-500 border-rose-500/30 cursor-not-allowed",
          "dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/40",
        ],
        // General Disabled State
        isDisabled && !isReserved && !isBooked && "opacity-40 cursor-not-allowed",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      )}
      aria-label={`Seat ${seatNumber} - ${status}`}
    >
      {/* Visual seat cushion accent */}
      <span
        className={cn(
          "w-full flex-1 rounded-t-lg rounded-b-sm flex items-center justify-center transition-colors relative",
          status === "available" && "bg-muted/10 group-hover:bg-muted/20",
          selected && "bg-background/10",
          isReserved && !selected && "bg-amber-500/10",
          isBooked && !selected && "bg-rose-500/10",
        )}
      >
        <span className="relative z-10 leading-none">{seatNumber}</span>
      </span>

      {/* Bottom cushion divider */}
      <span
        className={cn(
          "w-full h-1 mt-0.5 rounded-sm transition-colors",
          status === "available" && "bg-muted-foreground/20 group-hover:bg-muted-foreground/45",
          selected && "bg-background/40",
          isReserved && !selected && "bg-amber-500/30",
          isBooked && !selected && "bg-rose-500/30",
        )}
      />

      {/* Lock icon overlay for booked seats */}
      {isBooked && (
        <span className="absolute inset-0 flex items-center justify-center bg-rose-500/5 rounded-t-xl rounded-b-md">
          <svg
            className="h-4.5 w-4.5 text-rose-500/70"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
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
