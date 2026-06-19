"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarDays,
  TicketCheck,
  ArrowRight,
  Users,
  User,
  LogIn,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/hooks/useRedux";

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
    <Card className="h-full border border-border hover:border-foreground transition-all duration-200 hover:shadow-none bg-card">
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
  const { user, isAuth } = useAppSelector((state) => state.auth);

  const actions = [
    {
      icon: CalendarDays,
      title: "Browse Events",
      description: "Explore available events and reserve seats in real time.",
      href: "/events",
    },
  ];

  if (isAuth) {
    actions.unshift({
      icon: Plus,
      title: "Create an Event",
      description:
        "Set up a new seat booking event with venue, capacity and date details.",
      href: "/events?create=true",
    });
    actions.push(
      {
        icon: TicketCheck,
        title: "My Reservations",
        description:
          "View and confirm your active reserved seats before they expire.",
        href: "/reservations",
      },
      {
        icon: Users,
        title: "My Bookings",
        description: "Check all your finalized ticket and seat bookings.",
        href: "/bookings",
      },
      {
        icon: User,
        title: "My Profile",
        description:
          "Manage your profile details and update account security preferences.",
        href: "/profile",
      },
    );
  } else {
    actions.push({
      icon: LogIn,
      title: "Sign In",
      description:
        "Log in to your account to reserve seats and manage bookings.",
      href: "/login",
    });
  }

  return (
    <div className="space-y-10 pb-12">
      <div className="relative rounded-2xl overflow-hidden bg-zinc-950 text-white dark:bg-card dark:border dark:border-border min-h-55 flex flex-col justify-between p-8">
        <SeatRowIllustration />
        <div className="relative z-10 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-50">
            {isAuth ? `Welcome back, ${user?.name}` : "Welcome to"}
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
          {actions.map((action, index) => (
            <ActionCard
              key={index}
              icon={action.icon}
              title={action.title}
              description={action.description}
              href={action.href}
            />
          ))}
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Getting Started & How it Works */}
      <section className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-5">
            Getting Started
          </h2>
          <ul className="space-y-3.5">
            {isAuth ? (
              <>
                <Tip text="Create your first event by clicking 'Create an Event' from the Quick Actions." />
                <Tip text="Browse public events and try selecting some seats on the Seat Grid." />
                <Tip text="Confirm your seat reservations from the Reservations tab before the countdown timer expires." />
                <Tip text="Review your finalized bookings history in the Bookings tab." />
              </>
            ) : (
              <>
                <Tip text="Sign in to your account or register to start reserving seats." />
                <Tip text="Browse the list of events and check current seating availability." />
                <Tip text="Create and manage your own custom events once logged in." />
              </>
            )}
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
                sub: "Add details, date, venue, and seating capacity.",
              },
              {
                step: "02",
                label: "Reserve seats",
                sub: "Browse live events and select seats from the interactive map.",
              },
              {
                step: "03",
                label: "Confirm booking",
                sub: "Finalize your seat reservations from the Reservations page.",
              },
              {
                step: "04",
                label: "Manage bookings",
                sub: "Track all confirmed seat tickets in one place.",
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
