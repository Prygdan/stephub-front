import { revalidateTag } from 'next/cache';

export async function POST() {
  revalidateTag('reviews');
  return new Response(JSON.stringify({ ok: true }));
}
