import { TTimestamps } from "@/lib/types";
import { apiHelper, http } from "./instance";
import { secureRequest } from "@/hooks/use-csrf-cookie";
import { AxiosResponse } from "axios";

export type TCarouselItem = {
  id:           string
  image:        string
  image_mobile: string | null
}

export type TCarousel = TTimestamps & {
  id:           string
  page:         string
  category_id:  string
  items:        TCarouselItem[]
}

export type TCarouselCreate = {
  id:           string,
  page:         string | null
  category_id:  string | null
  items: Array<{
    image:        string
    image_mobile: string | null
  }>
}

const api = apiHelper('carousels');

export const get = async (): Promise<AxiosResponse<TCarousel[]>> => {
  try {
    return await api.get();
  } catch (error: unknown) {
    throw error;
  }
};

export const store = async (data: TCarouselCreate): Promise<AxiosResponse<TCarousel>> => {
  try {
    return await secureRequest(() => api.post(data));
  } catch (error: unknown) {
    throw error;
  }
}

export const destroy = async (id: string): Promise<AxiosResponse<void>> => {
  try {
    return await secureRequest(() => api.delete(id));
  } catch (error: unknown) {
    throw error;
  }
}

export const getCarouselsHome = async (): Promise<AxiosResponse<TCarousel | null>> => {
  try {
    return await http.get('api/carousels-home');
  } catch (error) {
    throw error;
  }
}
