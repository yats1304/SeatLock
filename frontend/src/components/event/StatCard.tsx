"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  highlight?: boolean;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  highlight,
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const previousValue = useRef(0);
  const animationFrame = useRef<number | null>(null);

  // Count‑up animation on value change
  useEffect(() => {
    const start = previousValue.current;
    const end = value;
    const duration = 600; // ms

    let startTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease‑out curve
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      setDisplayValue(current);

      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(step);
      }
    };

    animationFrame.current = requestAnimationFrame(step);
    previousValue.current = end;

    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, [value]);

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300",
        "border border-border bg-card",
        "hover:-translate-y-1 hover:shadow-lg hover:border-foreground",
        highlight && "border-foreground",
      )}
    >
      {/* Subtle shimmer line on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-linear-to-r from-transparent via-foreground/5 to-transparent pointer-events-none" />

      <CardContent className="relative p-4 flex items-center gap-3">
        {/* Icon container with subtle hover swap */}
        <div className="rounded-lg border border-border bg-background p-2 transition-colors duration-200 group-hover:bg-foreground group-hover:text-background">
          <Icon className="h-5 w-5 text-muted-foreground group-hover:text-background transition-colors" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tabular-nums transition-transform duration-300 group-hover:scale-105 origin-left">
            {displayValue.toLocaleString()}
          </p>
        </div>
      </CardContent>

      {/* Bottom accent bar that appears on hover */}
      <div className="absolute bottom-0 left-0 h-0.5 w-full bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </Card>
  );
}
