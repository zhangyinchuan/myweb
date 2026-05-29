import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import NextLink from 'next/link';
import { Tag } from '@/components/ui/Tag';
import { getBlogBySlug, getAllBlogSlugs } from '@/lib/strapi';
import { RichTextRenderer } from '@/components/features/RichTextRenderer';

export const revalidate = 60;

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return {};
  return {
    title: blog.title,
    description: blog.excerpt ?? undefined,
    openGraph: {
      title: blog.title,
      description: blog.excerpt ?? undefined,
      images: blog.cover?.url ? [{ url: blog.cover.url }] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) notFound();

  const publishedDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
      {/* Back link */}
      <Typography
        component={NextLink}
        href="/blog"
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
        ← 返回博客
      </Typography>

      {/* Header */}
      <Box component="header" sx={{ mb: 6 }}>
        {/* Category + date */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
          {blog.category && (
            <Typography
              component={NextLink}
              href={`/blog?category=${blog.category.slug}`}
              sx={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'primary.main',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {blog.category.name}
            </Typography>
          )}
          {blog.category && publishedDate && (
            <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>·</Typography>
          )}
          {publishedDate && (
            <Typography
              component="time"
              dateTime={blog.publishedAt ?? undefined}
              sx={{ fontSize: '0.875rem', color: 'text.secondary' }}
            >
              {publishedDate}
            </Typography>
          )}
          {blog.readingTime > 0 && (
            <>
              <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>·</Typography>
              <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                {blog.readingTime} min read
              </Typography>
            </>
          )}
        </Box>

        {/* Title */}
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: '2rem', md: '2.75rem' },
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            mb: 3,
          }}
        >
          {blog.title}
        </Typography>

        {/* Excerpt */}
        {blog.excerpt && (
          <Typography
            sx={{
              fontSize: { xs: '1.125rem', md: '1.25rem' },
              color: 'text.secondary',
              lineHeight: 1.6,
              mb: 3,
            }}
          >
            {blog.excerpt}
          </Typography>
        )}

        {/* Tags */}
        {blog.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {blog.tags.map((tag) => (
              <Tag key={tag.id} label={tag.name} href={`/blog?tag=${tag.slug}`} />
            ))}
          </Box>
        )}
      </Box>

      {/* Cover image */}
      {blog.cover && (
        <Box
          component="img"
          src={blog.cover.formats?.large?.url ?? blog.cover.url}
          alt={blog.coverAlt ?? blog.cover.alternativeText ?? blog.title}
          sx={{
            width: '100%',
            borderRadius: 2,
            mb: 6,
            aspectRatio: '16/9',
            objectFit: 'cover',
          }}
        />
      )}

      <Divider sx={{ mb: 6 }} />

      {/* Article body */}
      <Box component="article">
        {blog.content ? (
          <RichTextRenderer content={blog.content} />
        ) : (
          <Typography color="text.secondary">暂无内容</Typography>
        )}
      </Box>
    </Container>
  );
}
