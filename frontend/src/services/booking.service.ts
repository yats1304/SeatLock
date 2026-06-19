import api from "@/lib/axios";

export const confirmBooking = async (reservationId: string) => {
  const { data } = await api.post(`/booking/${reservationId}`);

  return data;
};

export const myBookings = async (page: number = 1, limit: number = 9) => {
  const { data } = await api.get(`/booking/my?page=${page}&limit=${limit}`);

  return data;
};
