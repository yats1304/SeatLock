"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar } from "lucide-react";
import EventCard from "@/components/event/EventCard";
import { getMyEvents, deleteEvent } from "@/services/event.service";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/Pagination";
import CreateEventModal from "@/components/event/CreateEventModal";
import { Modal } from "@/components/ui/Modal";
import toast from "react-hot-toast";

export default function MyEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEventForEdit, setSelectedEventForEdit] = useState<any>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEventForDelete, setSelectedEventForDelete] =
    useState<any>(null);

  useEffect(() => {
    fetchEvents();
  }, [page, searchQuery]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getMyEvents(page, searchQuery);
      setEvents(data.events || []);
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching my events:", error);
    } finally {
      setLoading(false);
    }
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

  const handleEdit = (event: any) => {
    setSelectedEventForEdit(event);
    setIsEditModalOpen(true);
  };

  const handleDelete = (event: any) => {
    setSelectedEventForDelete(event);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedEventForDelete) return;

    try {
      setLoading(true);
      await deleteEvent(selectedEventForDelete._id);
      toast.success("Event deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedEventForDelete(null);
      fetchEvents();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete event");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">My Events</h1>
          <p className="mt-1 text-muted-foreground">
            Manage and view the events you have created.
          </p>
        </div>
      </div>

      {/* Search & filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search your events by name..."
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
              <EventCard
                key={event._id}
                event={event}
                onEdit={() => handleEdit(event)}
                onDelete={() => handleDelete(event)}
              />
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
              : "You haven't created any events yet."}
          </p>
        </div>
      )}

      {/* Subtle bottom decoration */}
      <div className="h-px w-full bg-linear-to-r from-transparent via-border to-transparent" />

      {/* Edit Event Modal */}
      <CreateEventModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEventForEdit(null);
        }}
        onSuccess={fetchEvents}
        eventToEdit={selectedEventForEdit}
      />

      {/* Delete Event Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedEventForDelete(null);
        }}
        title="Delete Event"
        description="Are you sure you want to delete this event? This action cannot be undone and all associated seats will be deleted permanently."
      >
        <div className="space-y-6 pt-2">
          {selectedEventForDelete && (
            <div className="rounded-lg bg-muted/50 border p-4 space-y-1">
              <p className="font-semibold text-foreground text-sm">
                {selectedEventForDelete.name}
              </p>
              <p className="text-xs text-muted-foreground">
                Venue: {selectedEventForDelete.venue}
              </p>
              <p className="text-xs text-muted-foreground">
                Date:{" "}
                {new Date(selectedEventForDelete.dateTime).toLocaleString()}
              </p>
            </div>
          )}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedEventForDelete(null);
              }}
              disabled={loading}
              className="sm:w-auto w-full cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
              disabled={loading}
              className="sm:w-auto w-full cursor-pointer"
            >
              {loading ? "Deleting..." : "Delete Event"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
