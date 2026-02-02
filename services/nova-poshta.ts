import { http } from "./instance";
import { secureRequest } from "@/hooks/use-csrf-cookie";

export type TJobs = 'GetDeliveryAreas' | 'GetDeliveryCities' | 'GetDeliveryBranches' | 'GetDeliveryPostomates';
export type TJobsStatus = 'error' | 'processing' | 'success';

export type TGetJobStatus = {
  id: string
  name: TJobs
  status: TJobsStatus
  message: string
  created_at?: string
  updated_at?: string
}

export async function getJobStatus(id: string): Promise<TGetJobStatus> {
  return (await secureRequest(() => http.get(`api/delivery/get-job-status/${id}`))).data;
}

export async function getAreas(): Promise<TGetJobStatus> {
  return (await secureRequest(() => http.get(`api/delivery/get-areas/`))).data;
}

export async function getCities(): Promise<TGetJobStatus> {
  return (await secureRequest(() => http.get(`api/delivery/get-cities`))).data;
}

export async function getBranches(): Promise<TGetJobStatus> {
  return (await secureRequest(() => http.get(`api/delivery/get-branches`))).data;
}

export async function getPostomates(): Promise<TGetJobStatus> {
  return (await secureRequest(() => http.get(`api/delivery/get-postomates`))).data;
}
