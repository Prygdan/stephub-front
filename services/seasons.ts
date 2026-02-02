import { TTimestamps } from "@/lib/types";
import { apiHelper } from "./instance";
import { secureRequest } from "@/hooks/use-csrf-cookie";
import { AxiosResponse } from "axios";

export type TSeason = TTimestamps & {
  id: string
  name: string,
  slug: string,
}

const api = apiHelper('seasons');

export const get = async (): Promise<AxiosResponse<TSeason[]>> => {
  try {
    return await api.get();
  } catch (error: unknown) {
    throw error;
  }
};

export const store = async (data: TSeason): Promise<AxiosResponse<TSeason>> => {
  try {
    return await secureRequest(() => api.post(data));
  } catch (error: unknown) {
    throw error;
  }
}

export const update = async (slug: string, item: TSeason): Promise<AxiosResponse<TSeason>> => {
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