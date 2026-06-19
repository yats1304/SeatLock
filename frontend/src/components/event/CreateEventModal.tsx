"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createEvent } from "@/services/event.service";

const createEventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  venue: z.string().min(1, "Venue is required"),
  dateTime: z.string().min(1, "Date and time is required"),
  totalSeats: z
    .string()
    .min(1, "Total seats is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Total seats must be a positive number",
    }),
});

type CreateEventFormData = z.infer<typeof createEventSchema>;

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateEventModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateEventModalProps) {
  const [creating, setCreating] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      name: "",
      venue: "",
      dateTime: "",
      totalSeats: "",
    },
  });

  const onSubmit = async (data: CreateEventFormData) => {
    try {
      setCreating(true);
      const isoDateTime = new Date(data.dateTime).toISOString();
      await createEvent({
        name: data.name,
        venue: data.venue,
        dateTime: isoDateTime,
        totalSeats: Number(data.totalSeats),
      });
      toast.success("Event created successfully!");
      reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create event");
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    if (!creating) {
      reset();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Event"
      description="Fill out the details below to host a new seat booking event."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="eventName">Event Name</Label>
          <Input
            id="eventName"
            placeholder="e.g. Rock Concert"
            {...register("name")}
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="venue">Venue</Label>
          <Input
            id="venue"
            placeholder="e.g. Madison Square Garden"
            {...register("venue")}
            aria-invalid={!!errors.venue}
          />
          {errors.venue && (
            <p className="text-xs text-destructive">{errors.venue.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="dateTime">Date & Time</Label>
            <Input
              id="dateTime"
              type="datetime-local"
              className="cursor-pointer"
              {...register("dateTime")}
              aria-invalid={!!errors.dateTime}
            />
            {errors.dateTime && (
              <p className="text-xs text-destructive">{errors.dateTime.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="totalSeats">Total Seats</Label>
            <Input
              id="totalSeats"
              type="number"
              min="1"
              placeholder="e.g. 100"
              {...register("totalSeats")}
              aria-invalid={!!errors.totalSeats}
            />
            {errors.totalSeats && (
              <p className="text-xs text-destructive">{errors.totalSeats.message}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={creating}
            className="sm:w-auto w-full cursor-pointer"
          >
            Cancel
          </Button>
          <Button type="submit" className="sm:w-auto w-full cursor-pointer" disabled={creating}>
            {creating ? "Creating..." : "Create Event"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
