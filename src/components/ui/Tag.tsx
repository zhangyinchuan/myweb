import NextLink from 'next/link';
import Chip from '@mui/material/Chip';
import type { SxProps, Theme } from '@mui/material/styles';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TagProps {
  label: string;
  /** If provided, tag becomes a clickable link */
  href?: string;
  /** If provided, tag is interactive (onClick) */
  onClick?: () => void;
  /** Highlight this tag as selected/active */
  active?: boolean;
  size?: 'small' | 'medium';
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const getStyles = (active: boolean): Record<string, SxProps<Theme>> => ({
  chip: {
    borderRadius: '9999px',
    height: active ? 26 : 24,
    fontSize: '0.75rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: active ? 'primary.main' : 'action.hover',
    color: active ? 'primary.contrastText' : 'text.secondary',
    border: '1px solid',
    borderColor: active ? 'primary.main' : 'transparent',
    '&:hover': {
      backgroundColor: active ? 'primary.dark' : 'action.selected',
      color: active ? 'primary.contrastText' : 'text.primary',
    },
    '&:focus-visible': {
      outline: '2px solid',
      outlineColor: 'primary.main',
      outlineOffset: 2,
    },
  },
});

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Tag — 通用标签/徽章
 *
 * 支持三种模式：静态显示、点击交互、链接跳转。
 * 支持 active 激活状态（用于 FilterBar 选中效果）。
 *
 * @example
 * // 静态
 * <Tag label="React" />
 * // 可点击（FilterBar 用）
 * <Tag label="React" active={selected === 'react'} onClick={() => setSelected('react')} />
 * // 链接跳转
 * <Tag label="React" href="/blog?tag=react" />
 */
export function Tag({ label, href, onClick, active = false, size = 'small' }: TagProps) {
  const styles = getStyles(active);

  if (href) {
    return (
      <Chip
        label={label}
        size={size}
        component={NextLink}
        href={href}
        clickable
        sx={styles.chip}
      />
    );
  }

  if (onClick) {
    return (
      <Chip
        label={label}
        size={size}
        onClick={onClick}
        clickable
        sx={styles.chip}
        aria-pressed={active}
      />
    );
  }

  return (
    <Chip
      label={label}
      size={size}
      sx={styles.chip}
    />
  );
}
