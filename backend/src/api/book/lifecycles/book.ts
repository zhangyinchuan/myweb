/**
 * Book lifecycle hooks
 * 书籍内容发布/更新/删除时触发 Next.js ISR revalidation
 */

import type { Event } from '@strapi/database/dist/lifecycles';

const NEXTJS_REVALIDATE_URL = process.env.NEXTJS_REVALIDATE_URL ?? 'http://localhost:3000';
const NEXTJS_REVALIDATE_TOKEN = process.env.NEXTJS_REVALIDATE_TOKEN ?? '';

async function revalidatePaths(paths: string[]): Promise<void> {
  if (!NEXTJS_REVALIDATE_TOKEN) return;

  await Promise.allSettled(
    paths.map((path) =>
      fetch(`${NEXTJS_REVALIDATE_URL}/api/revalidate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${NEXTJS_REVALIDATE_TOKEN}`,
        },
        body: JSON.stringify({ path }),
      }).catch((err) => {
        console.error(`[lifecycle] revalidate failed for ${path}:`, err);
      })
    )
  );
}

export default {
  async afterCreate(event: Event) {
    const { result } = event;
    if (result.status === 'published') {
      await revalidatePaths(['/books', `/books/${result.slug}`]);
    }
  },

  async afterUpdate(event: Event) {
    const { result } = event;
    await revalidatePaths(['/books', `/books/${result.slug}`]);
  },

  async afterDelete(event: Event) {
    const { result } = event;
    await revalidatePaths(['/books', `/books/${result.slug}`]);
  },
};
