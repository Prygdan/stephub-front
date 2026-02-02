import { PaginatedResponse } from "@/lib/types";
import { apiHelper, http } from "../instance";
import { AxiosError, AxiosResponse } from "axios";
import { secureRequest } from "@/hooks/use-csrf-cookie";

export type TCiti = {
  id: string;
  created_at?: string;
  updated_at?: string;
  areaRef: string
  ref: string
  description: string
}

const api = apiHelper('delivery/cities');

export const get = async (page = 1): Promise<AxiosResponse<PaginatedResponse<TCiti>>> => {
  return (await api.get({ page }));
};

export const show = async (areaRef: string): Promise<TCiti[] | null> => {
  if (!areaRef) {
    console.log('Area reference is missing');
    return null;
  }

  try {
    const response = await http.get(`/api/delivery/get-cities-area/${areaRef}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 400) {
        console.log('Bad Request: Invalid areaRef or other issue', error);
        return null; 
      }
      console.log('Axios error:', error);
    } else {
      console.log('Unexpected error:', error);
    }
    return null; 
  }
};

export const destroy = async (id: string) => {
  return await secureRequest(() => api.delete(id));
};
