import { secureRequest } from "@/hooks/use-csrf-cookie";
import { apiHelper } from "../instance";
import { PaginatedResponse } from "@/lib/types";
import { AxiosResponse } from "axios";

export interface TArea {
  id: string
  ref: string
  description: string
  created_at?: string
  updated_at?: string
}

const api = apiHelper('delivery/areas');

export const get = async (page = 1): Promise<AxiosResponse<PaginatedResponse<TArea>>> => {
  return (await api.get({ page }));
};

export const destroy = async (id: string) => {
  return await secureRequest(() => api.delete(id));
};