export interface Reservation {
  _id: string;

  userId: string;

  eventId: {
    _id: string;
    name: string;
    venue: string;
    dateTime: string;
  };

  seatNumbers: string[];

  expiredAt: string;

  createdAt: string;

  updatedAt: string;
}
