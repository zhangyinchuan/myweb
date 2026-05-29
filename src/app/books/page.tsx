import type { Metadata } from 'next';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Suspense } from 'react';
import { ContentCard } from '@/components/ui/ContentCard';
import { ContentFilter } from '@/components/features/ContentFilter';
import { getBooks, getCategoriesByType, getTagsForContentType } from '@/lib/strapi';
import type { Book } from '@/types';

export const revalidate = 60;

export const metadata: Metadata = {
  title: '书籍',
  description: '书单推荐与读书笔记',
};

interface BookListPageProps {
  searchParams: Promise<{ category?: string; tag?: string; page?: string }>;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <Typography
      component="span"
      sx={{ fontSize: '0.875rem', color: '#F59E0B', letterSpacing: '-1px' }}
      aria-label={`评分 ${rating} 星`}
    >
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </Typography>
  );
}

function BookGrid({ books }: { books: Book[] }) {
  if (books.length === 0) {
    return (
      <Box sx={{ py: 12, textAlign: 'center' }}>
        <Typography color="text.secondary">当前筛选条件下暂无书籍</Typography>
      </Box>
    );
  }
  return (
    <Grid container spacing={3}>
      {books.map((book) => (
        <Grid item key={book.id} xs={12} sm={6} md={4} lg={3}>
          <ContentCard
            title={book.title}
            href={`/books/${book.slug}`}
            imageUrl={book.cover?.formats?.small?.url ?? book.cover?.url ?? undefined}
            imageAlt={book.cover?.alternativeText ?? book.title}
            imageRatio={2 / 3}
            excerpt={book.shortReview ?? undefined}
            category={book.category?.name}
            tags={book.tags.map((t) => ({ id: String(t.id), label: t.name }))}
            meta={book.rating ? `${'★'.repeat(book.rating)}${'☆'.repeat(5 - book.rating)}` : undefined}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default async function BookListPage({ searchParams }: BookListPageProps) {
  const { category, tag, page } = await searchParams;

  const [{ data: books }, categories, tags] = await Promise.all([
    getBooks({
      page: page ? Number(page) : 1,
      pageSize: 12,
      categorySlug: category ?? null,
      tagSlug: tag ?? null,
    }),
    getCategoriesByType('book'),
    getTagsForContentType('books'),
  ]);

  return (
    <Container sx={{ py: { xs: 6, md: 10 } }}>
      <Box sx={{ mb: { xs: 6, md: 8 } }}>
        <Typography
          component="h1"
          sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 700, letterSpacing: '-0.02em', mb: 1.5 }}
        >
          书籍
        </Typography>
        <Typography color="text.secondary">书单推荐与读书笔记</Typography>
      </Box>

      <Suspense fallback={null}>
        <ContentFilter categories={categories} tags={tags} />
      </Suspense>

      <BookGrid books={books} />
    </Container>
  );
}
