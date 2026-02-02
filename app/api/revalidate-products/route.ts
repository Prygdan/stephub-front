import { revalidateTag } from 'next/cache';

export async function POST() {
  revalidateTag('discountProducts');
  return new Response(JSON.stringify({ ok: true }));
}
