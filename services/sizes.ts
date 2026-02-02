import { TTimestamps } from "@/lib/types";
import { apiHelper } from "./instance";
import { secureRequest } from "@/hooks/use-csrf-cookie";
import { AxiosResponse } from "axios";

export type TSize = TTimestamps & {
  id: string
  value_eu: string,
  value_cm: string,
}

const api = apiHelper('sizes');

export const get = async (): Promise<AxiosResponse<TSize[]>> => {
  try {
    return await api.get();
  } catch (error: unknown) {
    throw error;
  }
};

export const store = async (data: TSize): Promise<AxiosResponse<TSize>> => {
  try {
    return await secureRequest(() => api.post(data));
  } catch (error: unknown) {
    throw error;
  }
}

export const update = async (id: string, item: TSize): Promise<AxiosResponse<TSize>> => {
  try {
    return await secureRequest(() => api.put(id, item));
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