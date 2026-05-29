'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import { FilterBar } from '@/components/ui/FilterBar';
import type { StrapiCategory, StrapiTag } from '@/types';

interface ContentFilterProps {
  categories: StrapiCategory[];
  tags: StrapiTag[];
}

/**
 * ContentFilter — 客户端筛选栏（URL 参数同步）
 *
 * 使用 useSearchParams + useRouter 同步筛选状态到 URL，
 * 避免用 useState + useEffect 做无谓的状态镜像。
 */
export function ContentFilter({ categories, tags }: ContentFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get('category');
  const selectedTag = searchParams.get('tag');

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Reset page when filter changes
      params.delete('page');
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  return (
    <Box sx={{ mb: 6 }}>
      <FilterBar
        categories={categories.map((c) => ({ id: c.slug, label: c.name }))}
        tags={tags.map((t) => ({ id: t.slug, label: t.name }))}
        selectedCategory={selectedCategory}
        selectedTag={selectedTag}
        onCategoryChange={(id) => updateParam('category', id)}
        onTagChange={(id) => updateParam('tag', id)}
      />
    </Box>
  );
}
