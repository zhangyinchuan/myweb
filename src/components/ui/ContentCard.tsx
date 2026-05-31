import NextLink from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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
  publishedAt?: string;
  imageUrl?: string;
  imageAlt?: string;
  excerpt?: string;
  category?: string;
  tags?: ContentCardTag[];
  meta?: string;
  sx?: SxProps<Theme>;
  imageRatio?: number;
}

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
 * ContentCard — borderless editorial card
 *
 * No card border/shadow. Hover tints the background.
 * Cover image zooms subtly on hover.
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
    <Box
      component={NextLink}
      href={href}
      aria-label={title}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'background-color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
        '&:hover .card-image': {
          transform: 'scale(1.04)',
        },
        ...(sx as object),
      }}
    >
      {/* Cover image */}
      {imageUrl && (
        <Box
          sx={{
            width: '100%',
            aspectRatio: String(imageRatio),
            overflow: 'hidden',
            flexShrink: 0,
            borderRadius: 2,
            backgroundColor: 'action.hover',
          }}
        >
          <Box
            component="img"
            src={imageUrl}
            alt={imageAlt || title}
            className="card-image"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transition: 'transform 500ms cubic-bezier(0.32, 0.72, 0, 1)',
            }}
          />
        </Box>
      )}

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          pt: imageUrl ? 2 : 0,
          pb: 1,
          px: 0.5,
        }}
      >
        {/* Category + date */}
        {(category || publishedAt) && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            {category && (
              <Typography
                component="span"
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: 'text.secondary',
                  letterSpacing: '0.02em',
                }}
              >
                {category}
              </Typography>
            )}
            {category && publishedAt && (
              <Typography component="span" sx={{ fontSize: '0.75rem', color: 'divider' }}>
                /
              </Typography>
            )}
            {publishedAt && (
              <Typography
                component="time"
                dateTime={publishedAt}
                sx={{ fontSize: '0.75rem', color: 'text.secondary' }}
              >
                {formatDate(publishedAt)}
              </Typography>
            )}
          </Box>
        )}

        {/* Title */}
        <Typography
          component="h3"
          sx={{
            fontWeight: 600,
            fontSize: { xs: '1rem', md: '1.0625rem' },
            lineHeight: 1.4,
            letterSpacing: '-0.01em',
            color: 'text.primary',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {title}
        </Typography>

        {/* Excerpt */}
        {excerpt && (
          <Typography
            sx={{
              fontSize: '0.875rem',
              color: 'text.secondary',
              lineHeight: 1.6,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {excerpt}
          </Typography>
        )}

        {/* Tags + meta */}
        {(tags.length > 0 || meta) && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: 'auto',
              pt: 1,
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            {tags.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                {tags.slice(0, 3).map((tag) => (
                  <Tag key={tag.id} label={tag.label} />
                ))}
              </Box>
            )}
            {meta && (
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', whiteSpace: 'nowrap' }}>
                {meta}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
