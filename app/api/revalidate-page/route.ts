import { revalidateTag } from 'next/cache';

export async function POST() {
  revalidateTag('page');
  return new Response(JSON.stringify({ ok: true }));
}