import type {
  Blog,
  Video,
  Book,
  Global,
  StrapiCategory,
  StrapiTag,
  StrapiListResponse,
  StrapiSingleResponse,
  ListQueryParams,
} from '@/types';

// ─── Config ───────────────────────────────────────────────────────────────────

const STRAPI_URL = process.env.STRAPI_URL ?? 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN ?? '';

const DEFAULT_REVALIDATE = 60; // seconds — ISR

// ─── Fetch Helper ─────────────────────────────────────────────────────────────

async function strapiRequest<T>(
  path: string,
  params?: Record<string, string>,
  revalidate = DEFAULT_REVALIDATE
): Promise<T> {
  const url = new URL(`${STRAPI_URL}/api${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, value);
      }
    });
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${STRAPI_TOKEN}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`Strapi request failed: ${res.status} ${res.statusText} — ${url.toString()}`);
  }

  return res.json() as Promise<T>;
}

// ─── Query String Helpers ─────────────────────────────────────────────────────

function buildListParams(
  populate: string[],
  { page = 1, pageSize = 12, categorySlug, tagSlug, sort = 'publishedAt:desc' }: ListQueryParams
): Record<string, string> {
  const params: Record<string, string> = {
    'pagination[page]': String(page),
    'pagination[pageSize]': String(pageSize),
    'sort': sort,
    'filters[status][$eq]': 'published',
  };

  populate.forEach((p, i) => {
    params[`populate[${i}]`] = p;
  });

  if (categorySlug) {
    params['filters[category][slug][$eq]'] = categorySlug;
  }
  if (tagSlug) {
    params['filters[tags][slug][$eq]'] = tagSlug;
  }

  return params;
}

// ─── Blog API ─────────────────────────────────────────────────────────────────

const BLOG_POPULATE = ['cover', 'category', 'tags'];

export async function getBlogs(query: ListQueryParams = {}): Promise<StrapiListResponse<Blog>> {
  return strapiRequest('/blogs', buildListParams(BLOG_POPULATE, query));
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const res = await strapiRequest<StrapiListResponse<Blog>>('/blogs', {
    'filters[slug][$eq]': slug,
    'filters[status][$eq]': 'published',
    'populate[0]': 'cover',
    'populate[1]': 'category',
    'populate[2]': 'tags',
  });
  return res.data[0] ?? null;
}

export async function getLatestBlogs(limit = 6): Promise<Blog[]> {
  const res = await getBlogs({ pageSize: limit });
  return res.data;
}

// ─── Video API ────────────────────────────────────────────────────────────────

const VIDEO_POPULATE = ['thumbnail', 'category', 'tags'];

export async function getVideos(query: ListQueryParams = {}): Promise<StrapiListResponse<Video>> {
  return strapiRequest('/videos', buildListParams(VIDEO_POPULATE, query));
}

export async function getVideoBySlug(slug: string): Promise<Video | null> {
  const res = await strapiRequest<StrapiListResponse<Video>>('/videos', {
    'filters[slug][$eq]': slug,
    'filters[status][$eq]': 'published',
    'populate[0]': 'thumbnail',
    'populate[1]': 'category',
    'populate[2]': 'tags',
  });
  return res.data[0] ?? null;
}

export async function getLatestVideos(limit = 6): Promise<Video[]> {
  const res = await getVideos({ pageSize: limit });
  return res.data;
}

// ─── Book API ─────────────────────────────────────────────────────────────────

const BOOK_POPULATE = ['cover', 'category', 'tags'];

export async function getBooks(query: ListQueryParams = {}): Promise<StrapiListResponse<Book>> {
  return strapiRequest('/books', buildListParams(BOOK_POPULATE, query));
}

export async function getBookBySlug(slug: string): Promise<Book | null> {
  const res = await strapiRequest<StrapiListResponse<Book>>('/books', {
    'filters[slug][$eq]': slug,
    'filters[status][$eq]': 'published',
    'populate[0]': 'cover',
    'populate[1]': 'category',
    'populate[2]': 'tags',
  });
  return res.data[0] ?? null;
}

// ─── Global API ───────────────────────────────────────────────────────────────

export async function getGlobal(): Promise<Global | null> {
  try {
    const res = await strapiRequest<StrapiSingleResponse<Global>>(
      '/global',
      { 'populate[0]': 'avatar' },
      3600 // Global config: revalidate every hour
    );
    return res.data;
  } catch {
    return null;
  }
}

// ─── Categories & Tags ────────────────────────────────────────────────────────

export async function getCategoriesByType(
  type: 'blog' | 'video' | 'book'
): Promise<StrapiCategory[]> {
  const res = await strapiRequest<StrapiListResponse<StrapiCategory>>('/categories', {
    'filters[type][$eq]': type,
    'sort': 'name:asc',
    'pagination[pageSize]': '100',
  });
  return res.data;
}

export async function getTagsForContentType(
  contentType: 'blogs' | 'videos' | 'books'
): Promise<StrapiTag[]> {
  // Fetch tags used in published content of the given type
  const res = await strapiRequest<StrapiListResponse<StrapiTag>>('/tags', {
    [`filters[${contentType}][status][$eq]`]: 'published',
    'sort': 'name:asc',
    'pagination[pageSize]': '200',
  });
  return res.data;
}

// ─── Static Path Generation ───────────────────────────────────────────────────

export async function getAllBlogSlugs(): Promise<string[]> {
  const res = await strapiRequest<StrapiListResponse<Pick<Blog, 'slug'>>>('/blogs', {
    'filters[status][$eq]': 'published',
    'fields[0]': 'slug',
    'pagination[pageSize]': '1000',
  });
  return res.data.map((b) => b.slug);
}

export async function getAllVideoSlugs(): Promise<string[]> {
  const res = await strapiRequest<StrapiListResponse<Pick<Video, 'slug'>>>('/videos', {
    'filters[status][$eq]': 'published',
    'fields[0]': 'slug',
    'pagination[pageSize]': '1000',
  });
  return res.data.map((v) => v.slug);
}

export async function getAllBookSlugs(): Promise<string[]> {
  const res = await strapiRequest<StrapiListResponse<Pick<Book, 'slug'>>>('/books', {
    'filters[status][$eq]': 'published',
    'fields[0]': 'slug',
    'pagination[pageSize]': '1000',
  });
  return res.data.map((b) => b.slug);
}
