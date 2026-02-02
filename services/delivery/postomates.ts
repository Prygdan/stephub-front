import { PaginatedResponse } from "@/lib/types";
import { http } from "../instance";
import { AxiosError, AxiosResponse } from "axios";
import { secureRequest } from "@/hooks/use-csrf-cookie";

export type TPostomat = {
  id: string;
  created_at?: string;
  updated_at?: string;
  cityRef: string;
  ref: string;
  description: string;
};

export const get = async (page = 1): Promise<AxiosResponse<PaginatedResponse<TPostomat>>> => {
  return (await http.get(`api/delivery/postomates?page=${page}`));
};


export const show = async (cityRef: string): Promise<TPostomat[] | null> => {
  if (!cityRef) {
    console.log('City reference is missing');
    return null;
  }

  try {
    const response = await http.get(`/api/delivery/get-postmates-city/${cityRef}`);
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

export const destroy = async (id: string): Promise<void> => {
  return (await secureRequest(() => http.delete(`api/delivery/postomates/${id}`))).data;
}
