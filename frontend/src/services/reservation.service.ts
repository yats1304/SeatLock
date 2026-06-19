import api from "@/lib/axios";

export const reserveSeats = async (eventId: string, seatNumbers: string[]) => {
  const { data } = await api.post(`/reservations/create/${eventId}`, {
    seatNumbers,
  });

  return data;
};

export const getMyReservations = async () => {
  const { data } = await api.get("/reservations/my");

  return data;
};

export const getReservationById = async (reservationId: string) => {
  const { data } = await api.get(`/reservations/${reservationId}`);

  return data;
};

export const confirmReservation = async (reservationId: string) => {
  const { data } = await api.post(`/booking/${reservationId}`);

  return data;
};
