import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarDays,
  TicketCheck,
  MapPin,
  ArrowRight,
  Users,
  Layers,
} from "lucide-react";
import Link from "next/link";

const SeatRowIllustration = () => {
  const rows = [
    { count: 6, scale: 0.7, opacity: 0.06 },
    { count: 9, scale: 0.82, opacity: 0.09 },
    { count: 12, scale: 0.91, opacity: 0.13 },
    { count: 14, scale: 1, opacity: 0.2 },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-2 pb-4 select-none overflow-hidden">
      {rows.map((row, i) => (
        <div key={i} className="flex gap-2" style={{ opacity: row.opacity }}>
          {Array.from({ length: row.count }).map((_, j) => (
            <div
              key={j}
              className="bg-white/30 dark:bg-foreground/20 rounded-t-sm 
                         transition-colors duration-200 ease-out
                         hover:bg-white dark:hover:bg-white"
              style={{
                width: `${row.scale * 28}px`,
                height: `${row.scale * 22}px`,
                borderRadius: `${row.scale * 4}px ${row.scale * 4}px 2px 2px`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
// --- Quick Action Card ---
const ActionCard = ({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
}) => (
  <Link href={href} className="group block">
    <Card className="h-full border border-border hover:border-foreground transition-all duration-200 hover:shadow-none">
      <CardContent className="p-6 flex flex-col gap-4 h-full">
        <div className="w-12 h-12 rounded-xl border border-border flex items-center justify-center bg-background group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-200">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          Get started
          <ArrowRight className="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-1 transition-transform" />
        </div>
      </CardContent>
    </Card>
  </Link>
);

const Tip = ({ text }: { text: string }) => (
  <li className="flex items-start gap-3 text-sm text-muted-foreground">
    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
    {text}
  </li>
);

export default function DashboardPage() {
  return (
    <div className="space-y-10 pb-12">
      <div className="relative rounded-2xl overflow-hidden bg-zinc-950 text-white dark:bg-card dark:border dark:border-border min-h-55 flex flex-col justify-between p-8">
        <SeatRowIllustration />
        <div className="relative z-10 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-50">
            Welcome to
          </p>
          <h1 className="text-4xl font-bold tracking-tight">SeatLock</h1>
        </div>
        <div className="relative z-10 max-w-lg">
          <p className="text-sm opacity-60 leading-relaxed">
            Your all-in-one platform for managing events, reserving seats, and
            confirming bookings. Everything you need is just a few clicks away.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-5">
          Quick Actions
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ActionCard
            icon={CalendarDays}
            title="Create an Event"
            description="Set up a new event with venue details, date, and seating capacity."
            href="/events/new"
          />
          <ActionCard
            icon={MapPin}
            title="Manage Venues"
            description="Configure your venues, seat layouts, and section maps."
            href="/venues"
          />
          <ActionCard
            icon={TicketCheck}
            title="View Reservations"
            description="Browse all active reservations and update their status."
            href="/reservations"
          />
          <ActionCard
            icon={Users}
            title="Attendees"
            description="See who's coming to your events and manage guest lists."
            href="/attendees"
          />
          <ActionCard
            icon={Layers}
            title="Seat Plans"
            description="Design and assign seat plans to any of your upcoming events."
            href="/seat-plans"
          />
          <ActionCard
            icon={CalendarDays}
            title="Upcoming Events"
            description="Review all scheduled events and their current booking status."
            href="/events"
          />
        </div>
      </section>

      <div className="border-t border-foreground/20" />

      {/* Getting Started & How it Works */}
      <section className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-5">
            Getting Started
          </h2>
          <ul className="space-y-3.5">
            <Tip text="Create your first event by heading to Events → New Event." />
            <Tip text="Set up a venue and define seat rows before assigning a seat plan." />
            <Tip text="Once an event is live, share the booking link with your attendees." />
            <Tip text="Track reservations in real time from the Reservations tab." />
          </ul>
        </div>

        {/* How it works card */}
        <div className="rounded-2xl border border-border p-6 flex flex-col gap-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            How it works
          </h2>
          <div className="space-y-5">
            {[
              {
                step: "01",
                label: "Create an event",
                sub: "Add details, date, and venue.",
              },
              {
                step: "02",
                label: "Assign a seat plan",
                sub: "Map seats to sections and rows.",
              },
              {
                step: "03",
                label: "Open for bookings",
                sub: "Let attendees reserve their spots.",
              },
              {
                step: "04",
                label: "Confirm & manage",
                sub: "Track, confirm, or cancel reservations.",
              },
            ].map(({ step, label, sub }) => (
              <div key={step} className="flex items-start gap-4">
                <span className="text-xs font-bold tabular-nums text-muted-foreground w-6 shrink-0 mt-0.5">
                  {step}
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground leading-none mb-0.5">
                    {label}
                  </p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
