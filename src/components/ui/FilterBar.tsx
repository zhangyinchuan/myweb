'use client';

import { useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { Tag } from './Tag';
import type { SxProps, Theme } from '@mui/material/styles';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FilterItem {
  id: string;
  label: string;
}

interface FilterBarProps {
  categories?: FilterItem[];
  tags?: FilterItem[];
  selectedCategory?: string | null;
  selectedTag?: string | null;
  onCategoryChange?: (id: string | null) => void;
  onTagChange?: (id: string | null) => void;
  /** Label for the "All" option */
  allLabel?: string;
  sx?: SxProps<Theme>;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, SxProps<Theme>> = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  section: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 1,
  },
  sectionLabel: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: 'text.secondary',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    mr: 0.5,
    whiteSpace: 'nowrap',
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * FilterBar — 分类 + 标签筛选栏
 *
 * 展示分类和标签两行选择器，支持单选（点击再次选择取消）。
 * selectedCategory / selectedTag 为 null 表示"全部"。
 *
 * @example
 * <FilterBar
 *   categories={[{ id: 'tech', label: '技术' }]}
 *   tags={[{ id: 'react', label: 'React' }]}
 *   selectedCategory={cat}
 *   selectedTag={tag}
 *   onCategoryChange={setCat}
 *   onTagChange={setTag}
 * />
 */
export function FilterBar({
  categories = [],
  tags = [],
  selectedCategory = null,
  selectedTag = null,
  onCategoryChange,
  onTagChange,
  allLabel = '全部',
  sx,
}: FilterBarProps) {
  const handleCategoryClick = useCallback(
    (id: string | null) => {
      onCategoryChange?.(selectedCategory === id ? null : id);
    },
    [onCategoryChange, selectedCategory]
  );

  const handleTagClick = useCallback(
    (id: string | null) => {
      onTagChange?.(selectedTag === id ? null : id);
    },
    [onTagChange, selectedTag]
  );

  if (categories.length === 0 && tags.length === 0) return null;

  return (
    <Box sx={{ ...styles.root, ...(sx as object) }} role="search" aria-label="内容筛选">
      {/* Categories */}
      {categories.length > 0 && (
        <Box sx={styles.section}>
          <Typography sx={styles.sectionLabel} component="span">
            分类
          </Typography>
          <Tag
            label={allLabel}
            active={selectedCategory === null}
            onClick={() => handleCategoryClick(null)}
          />
          {categories.map((cat) => (
            <Tag
              key={cat.id}
              label={cat.label}
              active={selectedCategory === cat.id}
              onClick={() => handleCategoryClick(cat.id)}
            />
          ))}
        </Box>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <Box sx={styles.section}>
          <Typography sx={styles.sectionLabel} component="span">
            标签
          </Typography>
          <Tag
            label={allLabel}
            active={selectedTag === null}
            onClick={() => handleTagClick(null)}
          />
          {tags.map((tag) => (
            <Tag
              key={tag.id}
              label={tag.label}
              active={selectedTag === tag.id}
              onClick={() => handleTagClick(tag.id)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
