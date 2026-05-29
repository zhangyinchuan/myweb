import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import NextLink from 'next/link';
import { Tag } from '@/components/ui/Tag';
import { getBookBySlug, getAllBookSlugs } from '@/lib/strapi';
import { RichTextRenderer } from '@/components/features/RichTextRenderer';

export const revalidate = 60;

interface BookDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllBookSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BookDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  if (!book) return {};
  return {
    title: `${book.title} — ${book.author}`,
    description: book.shortReview ?? undefined,
    openGraph: {
      title: book.title,
      description: book.shortReview ?? undefined,
      images: book.cover?.url ? [{ url: book.cover.url }] : [],
    },
  };
}

function StarRating({ rating }: { rating: number }) {
  return (
    <Typography
      component="span"
      sx={{ fontSize: '1.25rem', color: '#F59E0B', letterSpacing: '-1px' }}
      aria-label={`评分 ${rating} 星（满分 5 星）`}
    >
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </Typography>
  );
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);

  if (!book) notFound();

  const publishedDate = book.publishedAt
    ? new Date(book.publishedAt).toLocaleDateString('zh-CN', {
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
        href="/books"
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
        ← 返回书籍
      </Typography>

      {/* Book header: cover + meta */}
      <Grid container spacing={4} sx={{ mb: 6 }} component="header">
        {/* Cover */}
        {book.cover && (
          <Grid item xs={12} sm={4} md={3}>
            <Box
              component="img"
              src={book.cover.formats?.small?.url ?? book.cover.url}
              alt={book.cover.alternativeText ?? book.title}
              sx={{
                width: '100%',
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                aspectRatio: '2/3',
                objectFit: 'cover',
              }}
            />
          </Grid>
        )}

        {/* Meta */}
        <Grid item xs={12} sm={book.cover ? 8 : 12} md={book.cover ? 9 : 12}>
          {/* Category */}
          {book.category && (
            <Typography
              component={NextLink}
              href={`/books?category=${book.category.slug}`}
              sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'primary.main', mb: 1.5, display: 'block', '&:hover': { textDecoration: 'underline' } }}
            >
              {book.category.name}
            </Typography>
          )}

          <Typography
            component="h1"
            sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' }, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2, mb: 1 }}
          >
            {book.title}
          </Typography>

          <Typography sx={{ fontSize: '1rem', color: 'text.secondary', mb: 2 }}>
            {book.author}
            {book.publisher && ` · ${book.publisher}`}
            {book.publishedYear && ` · ${book.publishedYear}`}
          </Typography>

          {book.rating && (
            <Box sx={{ mb: 2 }}>
              <StarRating rating={book.rating} />
            </Box>
          )}

          {book.shortReview && (
            <Typography sx={{ fontSize: '1rem', color: 'text.secondary', lineHeight: 1.7, mb: 2 }}>
              {book.shortReview}
            </Typography>
          )}

          {/* Tags */}
          {book.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {book.tags.map((tag) => (
                <Tag key={tag.id} label={tag.name} href={`/books?tag=${tag.slug}`} />
              ))}
            </Box>
          )}

          {publishedDate && (
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 2 }}>
              笔记发布于 {publishedDate}
            </Typography>
          )}
        </Grid>
      </Grid>

      <Divider sx={{ mb: 6 }} />

      {/* Reading notes */}
      {book.notes ? (
        <Box component="article">
          <Typography
            component="h2"
            sx={{ fontSize: '1.25rem', fontWeight: 600, mb: 4, color: 'text.primary' }}
          >
            读书笔记
          </Typography>
          <RichTextRenderer content={book.notes} />
        </Box>
      ) : (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>
          暂无读书笔记
        </Typography>
      )}
    </Container>
  );
}
