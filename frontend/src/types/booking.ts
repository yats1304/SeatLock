export interface Booking {
  _id: string;

  userId: string;

  eventId: {
    _id: string;
    name: string;
    venue: string;
    dateTime: string;
  };

  seatNumbers: string[];

  bookedAt: string;

  createdAt: string;

  updatedAt: string;
}
