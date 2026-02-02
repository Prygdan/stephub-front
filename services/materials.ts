import { TTimestamps } from "@/lib/types";
import { apiHelper } from "./instance";
import { secureRequest } from "@/hooks/use-csrf-cookie";
import { AxiosResponse } from "axios";

export type TMaterial = TTimestamps & {
  id: string
  name: string,
  slug: string,
}

const api = apiHelper('materials');

export const get = async (): Promise<AxiosResponse<TMaterial[]>> => {
  try {
    return await api.get();
  } catch (error: unknown) {
    throw error;
  }
};

export const store = async (data: TMaterial): Promise<AxiosResponse<TMaterial>> => {
  try {
    return await secureRequest(() => api.post(data));
  } catch (error: unknown) {
    throw error;
  }
}

export const update = async (slug: string, item: TMaterial): Promise<AxiosResponse<TMaterial>> => {
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