import Seat from "./Seat";

interface SeatData {
  _id: string;
  seatNumber: string;
  status: string;
  row?: string;
}

interface Props {
  seats: SeatData[];
  selectedSeats: string[];
  toggleSeat: (seatNumber: string) => void;
}

const Legend = () => (
  <div className="flex flex-wrap items-center gap-5 text-xs text-muted-foreground">
    {/* Available */}
    <div className="flex items-center gap-1.5">
      <div className="h-4 w-4 rounded border border-dashed border-border bg-background" />
      <span>Available</span>
    </div>

    {/* Selected */}
    <div className="flex items-center gap-1.5">
      <div className="h-4 w-4 rounded bg-foreground" />
      <span>Selected</span>
    </div>

    {/* Reserved — amber */}
    <div className="flex items-center gap-1.5">
      <div className="h-4 w-4 rounded bg-amber-500/20 border border-amber-400/50" />
      <span>
        Reserved{" "}
        <span className="text-muted-foreground/60">(held, not confirmed)</span>
      </span>
    </div>

    {/* Booked — rose */}
    <div className="flex items-center gap-1.5 relative">
      <div className="h-4 w-4 rounded bg-rose-500/20 border border-rose-400/40 flex items-center justify-center">
        <svg
          className="h-3 w-3 text-rose-400/70"
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
      </div>
      <span>
        Booked{" "}
        <span className="text-muted-foreground/60">(permanently taken)</span>
      </span>
    </div>
  </div>
);

export default function SeatGrid({ seats, selectedSeats, toggleSeat }: Props) {
  const grouped = seats.reduce<Record<string, SeatData[]>>((acc, seat) => {
    const rowKey = seat.row || "default";
    if (!acc[rowKey]) acc[rowKey] = [];
    acc[rowKey].push(seat);
    return acc;
  }, {});

  const rows = Object.entries(grouped);

  return (
    <div className="space-y-6">
      <Legend />
      <div className="space-y-8">
        {rows.map(([rowLabel, rowSeats]) => (
          <div key={rowLabel} className="space-y-2">
            {rowLabel !== "default" && (
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
                {rowLabel}
              </p>
            )}
            <div className="flex flex-wrap gap-2.5">
              {rowSeats.map((seat) => (
                <Seat
                  key={seat._id}
                  seatNumber={seat.seatNumber}
                  status={seat.status}
                  selected={selectedSeats.includes(seat.seatNumber)}
                  onClick={() => toggleSeat(seat.seatNumber)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
