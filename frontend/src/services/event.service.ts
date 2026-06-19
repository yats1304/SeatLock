import api from "@/lib/axios";

export const getEvent = async (page = 1, limit = 10, search = "") => {
  const { data } = await api.get(
    `/event?page=${page}&limit=${limit}&search=${search}`,
  );

  return data;
};

export const getEventKPIs = async () => {
  const { data } = await api.get("/event/kpis");

  return data;
};

export const getEventById = async (id: string) => {
  const { data } = await api.get(`/event/${id}`);

  return data;
};

export const getEventSeats = async (id: string) => {
  const { data } = await api.get(`/event/${id}/seats`);

  return data;
};

export const createEvent = async (payload: {
  name: string;
  venue: string;
  dateTime: string;
  totalSeats: number | string;
}) => {
  const { data } = await api.post("event/create", payload);

  return data;
};

export const updateEvent = async (eventId: string) => {
  const { data } = await api.patch(`event/:${eventId}`);

  return data;
};
