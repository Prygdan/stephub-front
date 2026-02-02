import { TMetaTags } from "@/lib/types";
import { apiHelper } from "./instance";
import { AxiosResponse } from "axios";
import { secureRequest } from "@/hooks/use-csrf-cookie";

const api = apiHelper('pages');

export interface TPage extends TMetaTags {
  id:         string
  slug:       string
  title:      string
  content:    string
}

export const get = async (): Promise<AxiosResponse<TPage[]>> => {
  try {
    return await api.get();
  } catch (error: unknown) {
    throw error;
  }
};

export const show = async (slug: string): Promise<AxiosResponse<TPage>> => {
  try {
    return await api.show(slug);
  } catch(error) {
    throw error;
  }
}

export const store = async (data: TPage): Promise<AxiosResponse<TPage>> => {
  try {
    return await secureRequest(() => api.post(data));
  } catch (error: unknown) {
    throw error;
  }
}

export const update = async (slug: string, item: TPage): Promise<AxiosResponse<TPage>> => {
  try {
    return await secureRequest(() => api.put(slug, item));
  } catch (error: unknown) {
    throw error;
  }
}

export const destroy = async (slug: string): Promise<AxiosResponse<void>> => {
  try {
    return await secureRequest(() => api.delete(slug));
  } catch (error: unknown) {
    throw error;
  }
}
