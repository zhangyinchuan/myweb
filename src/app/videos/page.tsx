import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Suspense } from 'react';
import { ContentCard } from '@/components/ui/ContentCard';
import { ContentFilter } from '@/components/features/ContentFilter';
import { getVideos, getCategoriesByType, getTagsForContentType } from '@/lib/strapi';
import type { Video } from '@/types';

export const revalidate = 60;

export const metadata: Metadata = {
  title: '视频',
  description: '精选视频推荐，来自 B站与 YouTube',
};

interface VideoListPageProps {
  searchParams: Promise<{ category?: string; tag?: string; page?: string }>;
}

function VideoGrid({ videos }: { videos: Video[] }) {
  if (videos.length === 0) {
    return (
      <Box sx={{ py: 12, textAlign: 'center' }}>
        <Typography color="text.secondary">当前筛选条件下暂无视频</Typography>
      </Box>
    );
  }
  return (
    <Grid container spacing={3}>
      {videos.map((video) => (
        <Grid item key={video.id} xs={12} sm={6} md={4}>
          <ContentCard
            title={video.title}
            href={`/videos/${video.slug}`}
            publishedAt={video.publishedAt ?? undefined}
            imageUrl={video.thumbnail?.formats?.medium?.url ?? video.thumbnail?.url ?? undefined}
            imageAlt={video.thumbnail?.alternativeText ?? video.title}
            excerpt={video.description ?? undefined}
            category={video.category?.name}
            tags={video.tags.map((t) => ({ id: String(t.id), label: t.name }))}
            meta={video.platform === 'bilibili' ? 'B站' : video.platform === 'youtube' ? 'YouTube' : video.platform}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default async function VideoListPage({ searchParams }: VideoListPageProps) {
  const { category, tag, page } = await searchParams;

  const [{ data: videos }, categories, tags] = await Promise.all([
    getVideos({
      page: page ? Number(page) : 1,
      pageSize: 12,
      categorySlug: category ?? null,
      tagSlug: tag ?? null,
    }),
    getCategoriesByType('video'),
    getTagsForContentType('videos'),
  ]);

  return (
    <Container sx={{ py: { xs: 6, md: 10 } }}>
      <Box sx={{ mb: { xs: 6, md: 8 } }}>
        <Typography
          component="h1"
          sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 700, letterSpacing: '-0.02em', mb: 1.5 }}
        >
          视频
        </Typography>
        <Typography color="text.secondary">精选 B站与 YouTube 推荐</Typography>
      </Box>

      <Suspense fallback={null}>
        <ContentFilter categories={categories} tags={tags} />
      </Suspense>

      <VideoGrid videos={videos} />
    </Container>
  );
}
