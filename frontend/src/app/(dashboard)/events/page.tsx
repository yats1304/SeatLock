"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, Calendar, Layers } from "lucide-react";
import KpiCard from "@/components/event/KpiCard";
import EventCard from "@/components/event/EventCard";
import { getEvent, getEventKPIs } from "@/services/event.service";
import Link from "next/link";
import { useAppSelector } from "@/hooks/useRedux";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/Pagination";
import CreateEventModal from "@/components/event/CreateEventModal";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [kpis, setKpis] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    CompletedEvents: 0,
  });

  const { isAuth } = useAppSelector((state) => state.auth);

  useEffect(() => {
    fetchKPIs();
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("create") === "true") {
        setIsCreateModalOpen(true);
        const newUrl = window.location.pathname;
        window.history.replaceState({}, "", newUrl);
      }
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [page, searchQuery]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getEvent(page, 9, searchQuery);
      setEvents(data.events);
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchKPIs = async () => {
    const data = await getEventKPIs();
    setKpis(data.data);
  };

  const handleSearch = () => {
    setPage(1);
    setSearchQuery(search);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Events</h1>
          <p className="mt-1 text-muted-foreground">
            {isAuth
              ? "Create, manage, and monitor your events in one place."
              : "Browse and discover upcoming events."}
          </p>
        </div>
        {isAuth && (
          <Button
            className="gap-2 group cursor-pointer"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
            Create your own event
          </Button>
        )}
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          title="Total Events"
          value={kpis.totalEvents}
          icon={Layers}
          trend="+12% from last month"
        />
        <KpiCard
          title="Upcoming"
          value={kpis.upcomingEvents}
          icon={Calendar}
          trend="Next 7 days"
        />
        <KpiCard
          title="Completed"
          value={kpis.CompletedEvents}
          icon={Calendar}
          trend="All time"
        />
      </div>

      {/* Search & filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by event name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {/* Events grid */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border p-6 space-y-5"
            >
              <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}
        </div>
      ) : events.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <Calendar className="mb-4 h-12 w-12 text-muted-foreground/60" />
          <h3 className="text-xl font-semibold">No events found</h3>
          <p className="mt-1 text-muted-foreground">
            {searchQuery
              ? "Try adjusting your search terms."
              : isAuth
                ? "Get started by creating your first event."
                : "Check back later for upcoming events."}
          </p>
          {isAuth && !searchQuery && (
            <Button
              variant="outline"
              className="gap-2 mt-6 cursor-pointer"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          )}
        </div>
      )}

      {/* Subtle bottom decoration */}
      <div className="h-px w-full bg-linear-to-r from-transparent via-border to-transparent" />

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          fetchEvents();
          fetchKPIs();
        }}
      />
    </div>
  );
}
