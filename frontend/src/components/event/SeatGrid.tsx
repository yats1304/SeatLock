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
      <div className="h-4 w-4 rounded border border-border bg-muted/10" />
      <span>Available</span>
    </div>

    {/* Selected */}
    <div className="flex items-center gap-1.5">
      <div className="h-4 w-4 rounded bg-foreground border border-foreground" />
      <span>Selected</span>
    </div>

    {/* Reserved — amber */}
    <div className="flex items-center gap-1.5">
      <div className="h-4 w-4 rounded bg-amber-500/10 border border-amber-500/30" />
      <span>
        Reserved{" "}
        <span className="text-muted-foreground/60">(held, not confirmed)</span>
      </span>
    </div>

    {/* Booked — rose */}
    <div className="flex items-center gap-1.5">
      <div className="h-4 w-4 rounded bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
        <svg
          className="h-2.5 w-2.5 text-rose-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
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
  // Sort seats numerically based on the digit part of the seatNumber (e.g. A17 -> 17)
  const sortedSeats = [...seats].sort((a, b) => {
    const numA = parseInt(a.seatNumber.replace(/\D/g, ""), 10) || 0;
    const numB = parseInt(b.seatNumber.replace(/\D/g, ""), 10) || 0;
    return numA - numB;
  });

  // Calculate dynamic seat capacity per row based on total seats
  const totalSeats = sortedSeats.length;
  let seatsPerRow = 10;
  if (totalSeats <= 20) {
    seatsPerRow = 5;
  } else if (totalSeats <= 50) {
    seatsPerRow = 8;
  } else if (totalSeats <= 100) {
    seatsPerRow = 10;
  } else {
    seatsPerRow = 12;
  }

  // Group sorted seats into virtual rows dynamically
  const groupedRows: { rowLabel: string; rowSeats: SeatData[] }[] = [];
  for (let i = 0; i < sortedSeats.length; i += seatsPerRow) {
    const rowIndex = Math.floor(i / seatsPerRow);
    const rowLabel = String.fromCharCode(65 + rowIndex); // Row A, B, C...
    const rowSeats = sortedSeats.slice(i, i + seatsPerRow);
    groupedRows.push({ rowLabel, rowSeats });
  }

  // Split rowSeats into left, center, and right sections to simulate aisles
  const getRowSections = (rowSeats: SeatData[]) => {
    const count = rowSeats.length;
    if (count <= 4) {
      return { left: rowSeats, center: [], right: [] };
    }
    const leftCount = Math.floor(count * 0.3);
    const rightCount = Math.floor(count * 0.3);
    const centerCount = count - leftCount - rightCount;

    return {
      left: rowSeats.slice(0, leftCount),
      center: rowSeats.slice(leftCount, leftCount + centerCount),
      right: rowSeats.slice(leftCount + centerCount),
    };
  };

  return (
    <div className="space-y-6 w-full">
      <Legend />

      <div className="w-full flex flex-col gap-2">
        {/* Theater Container with horizontal scrolling */}
        <div className="w-full overflow-x-auto pb-6 pt-8 border border-border/80 rounded-2xl bg-muted/10 scrollbar-thin">
          <div className="min-w-max px-12 flex flex-col items-center gap-8">
            
            {/* Curved Cinema Screen Design */}
            <div className="w-2/3 flex flex-col items-center mb-2">
              <div className="w-full h-1.5 bg-primary/20 dark:bg-primary/30 rounded-b-[40px] shadow-[0_12px_24px_rgba(var(--primary-rgb),0.12)] border-t border-primary/20" />
              <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-muted-foreground/60 mt-3 select-none">
                STAGE / SCREEN
              </span>
            </div>

            {/* Row Layout */}
            <div className="space-y-4">
              {groupedRows.map(({ rowLabel, rowSeats }) => {
                const { left, center, right } = getRowSections(rowSeats);

                return (
                  <div key={rowLabel} className="flex items-center justify-between gap-6">
                    {/* Left Row Indicator */}
                    <div className="w-6 text-center text-xs font-bold text-muted-foreground/40 select-none">
                      {rowLabel}
                    </div>

                    {/* Seats with Aisle spacing */}
                    <div className="flex items-center gap-6">
                      {/* Left Column Section */}
                      <div className="flex items-center gap-2">
                        {left.map((seat) => (
                          <Seat
                            key={seat._id}
                            seatNumber={seat.seatNumber}
                            status={seat.status}
                            selected={selectedSeats.includes(seat.seatNumber)}
                            onClick={() => toggleSeat(seat.seatNumber)}
                          />
                        ))}
                      </div>

                      {/* Center Column Section */}
                      {center.length > 0 && (
                        <div className="flex items-center gap-2">
                          {center.map((seat) => (
                            <Seat
                              key={seat._id}
                              seatNumber={seat.seatNumber}
                              status={seat.status}
                              selected={selectedSeats.includes(seat.seatNumber)}
                              onClick={() => toggleSeat(seat.seatNumber)}
                            />
                          ))}
                        </div>
                      )}

                      {/* Right Column Section */}
                      {right.length > 0 && (
                        <div className="flex items-center gap-2">
                          {right.map((seat) => (
                            <Seat
                              key={seat._id}
                              seatNumber={seat.seatNumber}
                              status={seat.status}
                              selected={selectedSeats.includes(seat.seatNumber)}
                              onClick={() => toggleSeat(seat.seatNumber)}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right Row Indicator */}
                    <div className="w-6 text-center text-xs font-bold text-muted-foreground/40 select-none">
                      {rowLabel}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Swipe helper text for mobile */}
        <p className="text-[10px] text-muted-foreground text-center animate-pulse md:hidden mt-1 select-none">
          ← Swipe horizontally to see all seats →
        </p>
      </div>
    </div>
  );
}
