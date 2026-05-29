import NextLink from 'next/link';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { Tag } from './Tag';
import type { SxProps, Theme } from '@mui/material/styles';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContentCardTag {
  id: string;
  label: string;
  href?: string;
}

interface ContentCardProps {
  title: string;
  href: string;
  /** ISO date string */
  publishedAt?: string;
  /** Cover/thumbnail image URL */
  imageUrl?: string;
  imageAlt?: string;
  excerpt?: string;
  category?: string;
  tags?: ContentCardTag[];
  /** Extra metadata row (e.g., "5 min read", "YouTube", "★★★★☆") */
  meta?: string;
  /** Override card styles */
  sx?: SxProps<Theme>;
  /** Aspect ratio for the cover image (default: 16/9) */
  imageRatio?: number;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, SxProps<Theme>> = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  actionArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    height: '100%',
    // Remove default ripple tint on hover
    '& .MuiCardActionArea-focusHighlight': { opacity: 0 },
  },
  media: {
    width: '100%',
    objectFit: 'cover',
    backgroundColor: 'action.hover',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5,
    p: 3,
    '&:last-child': { pb: 3 },
  },
  topMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    flexWrap: 'wrap',
  },
  category: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: 'primary.main',
    letterSpacing: '0.01em',
  },
  date: {
    fontSize: '0.75rem',
    color: 'text.secondary',
  },
  title: {
    fontWeight: 600,
    fontSize: { xs: '1rem', md: '1.125rem' },
    lineHeight: 1.4,
    letterSpacing: '-0.01em',
    color: 'text.primary',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  excerpt: {
    fontSize: '0.875rem',
    color: 'text.secondary',
    lineHeight: 1.6,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  bottomRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mt: 'auto',
    pt: 1,
    flexWrap: 'wrap',
    gap: 1,
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 0.75,
  },
  meta: {
    fontSize: '0.75rem',
    color: 'text.secondary',
    whiteSpace: 'nowrap',
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * ContentCard — 通用内容卡片
 *
 * 适用于博客文章、视频推荐、书籍推荐三种内容类型。
 * 使用 CardActionArea 使整个卡片可点击跳转。
 *
 * @example
 * <ContentCard
 *   title="如何学习 React"
 *   href="/blog/how-to-learn-react"
 *   publishedAt="2026-01-01"
 *   imageUrl="https://cdn.example.com/cover.jpg"
 *   excerpt="React 是一个用于构建用户界面的 JavaScript 库..."
 *   category="前端"
 *   tags={[{ id: 'react', label: 'React' }]}
 *   meta="5 min read"
 * />
 */
export function ContentCard({
  title,
  href,
  publishedAt,
  imageUrl,
  imageAlt,
  excerpt,
  category,
  tags = [],
  meta,
  sx,
  imageRatio = 16 / 9,
}: ContentCardProps) {
  return (
    <Card sx={{ ...styles.card, ...(sx as object) }}>
      <CardActionArea
        component={NextLink}
        href={href}
        sx={styles.actionArea}
        aria-label={title}
      >
        {/* Cover image */}
        {imageUrl && (
          <Box
            sx={{
              width: '100%',
              aspectRatio: String(imageRatio),
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <Box
              component="img"
              src={imageUrl}
              alt={imageAlt || title}
              sx={{
                ...styles.media,
                height: '100%',
                transition: 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1)',
                '.MuiCardActionArea-root:hover &': { transform: 'scale(1.03)' },
              }}
            />
          </Box>
        )}

        {/* Card content */}
        <CardContent sx={styles.content}>
          {/* Category + date row */}
          {(category || publishedAt) && (
            <Box sx={styles.topMeta}>
              {category && (
                <Typography sx={styles.category} component="span">
                  {category}
                </Typography>
              )}
              {category && publishedAt && (
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>·</Typography>
              )}
              {publishedAt && (
                <Typography sx={styles.date} component="time" dateTime={publishedAt}>
                  {formatDate(publishedAt)}
                </Typography>
              )}
            </Box>
          )}

          {/* Title */}
          <Typography sx={styles.title} component="h3">
            {title}
          </Typography>

          {/* Excerpt */}
          {excerpt && (
            <Typography sx={styles.excerpt}>{excerpt}</Typography>
          )}

          {/* Tags + meta */}
          <Box sx={styles.bottomRow}>
            {tags.length > 0 && (
              <Box sx={styles.tags}>
                {tags.slice(0, 3).map((tag) => (
                  <Tag key={tag.id} label={tag.label} />
                ))}
              </Box>
            )}
            {meta && (
              <Typography sx={styles.meta}>{meta}</Typography>
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
