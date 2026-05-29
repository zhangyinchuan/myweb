import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Suspense } from 'react';
import { ContentCard } from '@/components/ui/ContentCard';
import { ContentFilter } from '@/components/features/ContentFilter';
import { getBlogs, getCategoriesByType, getTagsForContentType } from '@/lib/strapi';
import type { Blog } from '@/types';

export const revalidate = 60;

export const metadata: Metadata = {
  title: '博客',
  description: '所有文章，按分类和标签筛选',
};

interface BlogListPageProps {
  searchParams: Promise<{ category?: string; tag?: string; page?: string }>;
}

// ─── Blog Grid ────────────────────────────────────────────────────────────────

function BlogGrid({ blogs }: { blogs: Blog[] }) {
  if (blogs.length === 0) {
    return (
      <Box sx={{ py: 12, textAlign: 'center' }}>
        <Typography color="text.secondary">当前筛选条件下暂无文章</Typography>
      </Box>
    );
  }
  return (
    <Grid container spacing={3}>
      {blogs.map((blog) => (
        <Grid item key={blog.id} xs={12} sm={6} md={4}>
          <ContentCard
            title={blog.title}
            href={`/blog/${blog.slug}`}
            publishedAt={blog.publishedAt ?? undefined}
            imageUrl={blog.cover?.formats?.medium?.url ?? blog.cover?.url ?? undefined}
            imageAlt={blog.coverAlt ?? blog.cover?.alternativeText ?? blog.title}
            excerpt={blog.excerpt ?? undefined}
            category={blog.category?.name}
            tags={blog.tags.map((t) => ({ id: String(t.id), label: t.name }))}
            meta={blog.readingTime ? `${blog.readingTime} min read` : undefined}
          />
        </Grid>
      ))}
    </Grid>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogListPage({ searchParams }: BlogListPageProps) {
  const { category, tag, page } = await searchParams;

  const [{ data: blogs }, categories, tags] = await Promise.all([
    getBlogs({
      page: page ? Number(page) : 1,
      pageSize: 12,
      categorySlug: category ?? null,
      tagSlug: tag ?? null,
    }),
    getCategoriesByType('blog'),
    getTagsForContentType('blogs'),
  ]);

  return (
    <Container sx={{ py: { xs: 6, md: 10 } }}>
      {/* Page header */}
      <Box sx={{ mb: { xs: 6, md: 8 } }}>
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontWeight: 700,
            letterSpacing: '-0.02em',
            mb: 1.5,
          }}
        >
          博客
        </Typography>
        <Typography color="text.secondary">记录思考与探索</Typography>
      </Box>

      {/* Filter (client component, wrapped in Suspense for searchParams) */}
      <Suspense fallback={null}>
        <ContentFilter categories={categories} tags={tags} />
      </Suspense>

      {/* Blog grid */}
      <BlogGrid blogs={blogs} />
    </Container>
  );
}
