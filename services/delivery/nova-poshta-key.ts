import { secureRequest } from "@/hooks/use-csrf-cookie";
import { apiHelper } from "../instance";
import { PaginatedResponse } from "@/lib/types";

export type TNovaPoshatKey = {
  id: string
  value: string
}

const api = apiHelper('delivery/key');

export const get = async (): Promise<PaginatedResponse<TNovaPoshatKey>> => {
  return (await api.get()).data;
};

export const store = async (item: TNovaPoshatKey) => {
  return (await secureRequest(() => api.post(item))).data;
};

export const update = async (id: string, item: TNovaPoshatKey) => {
  return (await secureRequest(() => api.put(id, item))).data;
};

export const destroy = async (id: string) => {
  return (await secureRequest(() => api.delete(id))).data;
};
