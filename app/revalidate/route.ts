import { revalidateTag } from 'next/cache';

export async function POST(req: Request) {
  const { secret, tags } = await req.json();

  if (secret !== process.env.REVALIDATE_SECRET) {
    return new Response('Forbidden', { status: 403 });
  }

  for (const tag of tags) {
    revalidateTag(tag);
  }

  return Response.json({ ok: true });
}