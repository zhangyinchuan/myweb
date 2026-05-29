import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import NextLink from 'next/link';
import { Tag } from '@/components/ui/Tag';
import { getVideoBySlug, getAllVideoSlugs } from '@/lib/strapi';

export const revalidate = 60;

interface VideoDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllVideoSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: VideoDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);
  if (!video) return {};
  return {
    title: video.title,
    description: video.description ?? undefined,
    openGraph: {
      title: video.title,
      description: video.description ?? undefined,
      images: video.thumbnail?.url ? [{ url: video.thumbnail.url }] : [],
    },
  };
}

/** Build the embed src URL for B站 or YouTube */
function buildEmbedUrl(platform: 'bilibili' | 'youtube' | 'other', embedId: string): string {
  if (platform === 'youtube') {
    return `https://www.youtube.com/embed/${embedId}?rel=0`;
  }
  if (platform === 'bilibili') {
    return `https://player.bilibili.com/player.html?bvid=${embedId}&page=1&high_quality=1`;
  }
  return '';
}

export default async function VideoDetailPage({ params }: VideoDetailPageProps) {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);

  if (!video) notFound();

  const embedUrl = buildEmbedUrl(video.platform, video.embedId);
  const publishedDate = video.publishedAt
    ? new Date(video.publishedAt).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
      {/* Back */}
      <Typography
        component={NextLink}
        href="/videos"
        sx={{
          fontSize: '0.875rem',
          color: 'text.secondary',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          mb: 4,
          '&:hover': { color: 'primary.main' },
          transition: 'color 150ms',
        }}
      >
        ← 返回视频
      </Typography>

      {/* Header */}
      <Box component="header" sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
          {video.category && (
            <Typography
              component={NextLink}
              href={`/videos?category=${video.category.slug}`}
              sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}
            >
              {video.category.name}
            </Typography>
          )}
          {publishedDate && (
            <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
              · {publishedDate}
            </Typography>
          )}
          {video.duration && (
            <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
              · {video.duration}
            </Typography>
          )}
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'text.inverse',
              bgcolor: video.platform === 'bilibili' ? '#FB7299' : '#FF0000',
              px: 1,
              py: 0.25,
              borderRadius: '4px',
            }}
          >
            {video.platform === 'bilibili' ? 'B站' : 'YouTube'}
          </Typography>
        </Box>

        <Typography
          component="h1"
          sx={{
            fontSize: { xs: '1.75rem', md: '2.5rem' },
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            mb: 3,
          }}
        >
          {video.title}
        </Typography>

        {video.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {video.tags.map((tag) => (
              <Tag key={tag.id} label={tag.name} href={`/videos?tag=${tag.slug}`} />
            ))}
          </Box>
        )}
      </Box>

      {/* Video embed */}
      {embedUrl ? (
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/9',
            borderRadius: 2,
            overflow: 'hidden',
            mb: 5,
            bgcolor: 'background.paper',
          }}
        >
          <Box
            component="iframe"
            src={embedUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
          />
        </Box>
      ) : (
        /* Fallback: link to original */
        <Box sx={{ mb: 5, p: 4, bgcolor: 'background.paper', borderRadius: 2, textAlign: 'center' }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            视频无法在此播放
          </Typography>
          <Typography
            component="a"
            href={video.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: 'primary.main', fontWeight: 500 }}
          >
            点击前往原平台观看 →
          </Typography>
        </Box>
      )}

      <Divider sx={{ mb: 4 }} />

      {/* Description */}
      {video.description && (
        <Typography sx={{ fontSize: '1rem', lineHeight: 1.75, color: 'text.secondary' }}>
          {video.description}
        </Typography>
      )}
    </Container>
  );
}
