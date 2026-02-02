import { TTimestamps } from "@/lib/types";
import { http } from "./instance"; 
import { secureRequest } from "@/hooks/use-csrf-cookie";
 
export type TProductImage = TTimestamps & {
  id:         string
  image:      string
  product_id: string
}

export async function get(productId: string): Promise<TProductImage[]> {
  try {
    return (await http.get(`api/uploadProductsImage/${productId}`)).data;
  } catch (error: unknown) {
    throw error;
  }
}
 
export async function store(productId: string, data: string): Promise<TProductImage> {
  try {
    return (await secureRequest(() => http.post('api/uploadProductsImage', {
      product_id: productId, 
      image: data
    })));
  } catch (error: unknown) {
    throw error;
  }
}
 
export async function destroy(productId: string, imageId: string): Promise<void> {
  try {
    return (await secureRequest(() => http.delete(`api/uploadProductsImage/${productId}/${imageId}`)));
  } catch (error: unknown) {
    throw error;
  }
}
 