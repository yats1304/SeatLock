import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  MapPin,
  Users,
  ArrowRight,
  Edit,
  Trash,
} from "lucide-react";
import { Event } from "@/types/event";

interface EventCardProps {
  event: Event;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function EventCard({ event, onEdit, onDelete }: EventCardProps) {
  const eventDate = new Date(event.dateTime);
  const isPast = eventDate < new Date();

  return (
    <Card className="group flex flex-col overflow-hidden border border-border transition-all duration-300 hover:border-foreground hover:shadow-lg">
      <CardContent className="flex flex-col flex-1 p-6">
        {/* Status badge & title */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold leading-tight line-clamp-2">
            {event.name}
          </h3>
          <span
            className={`ml-2 shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
              isPast
                ? "bg-muted text-muted-foreground"
                : "bg-foreground text-background"
            }`}
          >
            {isPast ? "Past" : "Upcoming"}
          </span>
        </div>

        {/* Details with icons */}
        <div className="space-y-2.5 mb-6 flex-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 shrink-0" />
            <span>{eventDate.toLocaleDateString()}</span>
            <span className="text-xs opacity-60">
              {eventDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4 shrink-0" />
            <span>{event.totalSeats} seats</span>
          </div>
        </div>

        {/* Action button */}
        <div className="mt-auto space-y-2">
          <Link href={`/events/${event._id}`}>
            <Button
              variant="outline"
              className="w-full group/btn border-border hover:bg-foreground hover:text-background dark:hover:text-white hover:border-foreground transition-all duration-200"
            >
              View Details
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </Link>

          {(onEdit || onDelete) && !isPast && (
            <div className="grid grid-cols-2 gap-2 mt-4">
              {onEdit && (
                <Button
                  variant="outline"
                  onClick={onEdit}
                  className="w-full cursor-pointer hover:bg-muted text-xs gap-1"
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="destructive"
                  onClick={onDelete}
                  className="w-full cursor-pointer text-xs gap-1"
                >
                  <Trash className="h-3 w-3" />
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
