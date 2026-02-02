import { revalidateTag } from 'next/cache';

export async function POST() {
  revalidateTag('subcategory');
  return new Response(JSON.stringify({ ok: true }));
}
