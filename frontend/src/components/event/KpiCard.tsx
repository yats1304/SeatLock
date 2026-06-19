import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: string; // optional trend indicator
}

export default function KpiCard({ title, value, icon: Icon, trend }: Props) {
  return (
    <Card className="group relative overflow-hidden border border-border bg-card transition-all duration-300 hover:border-foreground hover:shadow-2xl hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold tabular-nums">{value}</span>
              {trend && (
                <span className="text-xs font-medium text-muted-foreground">
                  {trend}
                </span>
              )}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-background p-2.5 group-hover:bg-foreground group-hover:text-background transition-colors duration-200">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {/* subtle bottom decoration */}
        <div className="absolute bottom-0 left-0 h-1 w-full bg-linear-to-r from-foreground/5 via-foreground/20 to-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </CardContent>
    </Card>
  );
}
