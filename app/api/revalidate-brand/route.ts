import { revalidateTag } from 'next/cache';

export async function POST() {
  revalidateTag('brand');
  revalidateTag('brand-get');
  
  return new Response(JSON.stringify({ ok: true }));
}