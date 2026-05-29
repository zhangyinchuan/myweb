import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

const REVALIDATE_TOKEN = process.env.NEXTJS_REVALIDATE_TOKEN ?? '';

/**
 * POST /api/revalidate
 *
 * Strapi lifecycle hooks 调用此端点触发 ISR 页面重新生成。
 * 请求体：{ path: string }
 * 鉴权：Authorization: Bearer <NEXTJS_REVALIDATE_TOKEN>
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  // Validate token
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!REVALIDATE_TOKEN || token !== REVALIDATE_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let path: string;
  try {
    const body = await req.json();
    path = body?.path;
    if (typeof path !== 'string' || !path.startsWith('/')) {
      throw new Error('Invalid path');
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  revalidatePath(path);
  console.log(`[revalidate] Revalidated: ${path}`);

  return NextResponse.json({ revalidated: true, path }, { status: 200 });
}
