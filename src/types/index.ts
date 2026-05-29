/**
 * types/index.ts — 统一类型导出
 *
 * 优先使用从 OpenAPI 规格自动生成的类型（generated/api.ts），
 * 该文件包含所有接口类型、枚举、type guards。
 *
 * 使用方式：
 *   import type { Blog, Video, Book, Global } from '@/types';
 *   import { isBlog, isApiError } from '@/types';
 */

// Re-export all generated types as the primary source of truth
export type {
  // Enums
  CategoryType,
  ContentStatus,
  VideoPlatform,
  BookRating,

  // Image
  ImageFormat,
  StrapiImage,

  // Rich Text
  RichTextNode,
  RichTextContent,

  // Content Types
  Category,
  Tag,
  BlogListItem,
  Blog,
  Video,
  Book,
  Global,

  // Response Wrappers
  PaginationMeta,
  StrapiListResponse,
  StrapiSingleResponse,
  BlogListResponse,
  BlogDetailResponse,
  VideoListResponse,
  BookListResponse,
  CategoryListResponse,
  TagListResponse,
  GlobalResponse,

  // Request Types
  GetBlogsRequest,
  GetBlogBySlugRequest,
  GetVideosRequest,
  GetVideoBySlugRequest,
  GetBooksRequest,
  GetBookBySlugRequest,
  GetCategoriesRequest,

  // Error
  ApiError,
} from './generated/api';

// Re-export type guards (runtime values, not just types)
export {
  isStrapiImage,
  isCategory,
  isTag,
  isBlogListItem,
  isBlog,
  isVideo,
  isBook,
  isGlobal,
  isStrapiListResponse,
  isApiError,
} from './generated/api';

// ─── Convenience alias used in strapi.ts ─────────────────────────────────────
// ListQueryParams is a frontend-specific helper type (not in OpenAPI spec)

export interface ListQueryParams {
  page?: number;
  pageSize?: number;
  categorySlug?: string | null;
  tagSlug?: string | null;
  sort?: string;
}
