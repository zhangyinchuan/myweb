/**
 * Auto-generated from: docs/openapi/api.openapi.yaml
 * Generated at: 2026-05-29T00:00:00Z
 *
 * DO NOT EDIT MANUALLY - Regenerate from OpenAPI schema
 */

// ============================================================================
// Primitive / Enum Types
// ============================================================================

export type CategoryType = "blog" | "video" | "book" | "general";

export type ContentStatus = "draft" | "published" | "archived";

export type VideoPlatform = "bilibili" | "youtube" | "other";

export type BookRating = 1 | 2 | 3 | 4 | 5;

// ============================================================================
// Image Types
// ============================================================================

export interface ImageFormat {
  /** CDN 完整 URL */
  url: string;
  width: number;
  height: number;
}

export interface StrapiImage {
  id: number;
  /** OSS CDN 完整 URL */
  url: string;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
  formats?: {
    thumbnail?: ImageFormat;
    small?: ImageFormat;
    medium?: ImageFormat;
    large?: ImageFormat;
  } | null;
  mime: string;
  /** 文件大小（KB） */
  size: number;
}

// ============================================================================
// Rich Text
// ============================================================================

export interface RichTextNode {
  type: string;
  text?: string | null;
  bold?: boolean | null;
  italic?: boolean | null;
  underline?: boolean | null;
  strikethrough?: boolean | null;
  code?: boolean | null;
  url?: string | null;
  level?: number | null;
  format?: "ordered" | "unordered" | null;
  children?: RichTextNode[] | null;
  image?: StrapiImage | null;
}

export type RichTextContent = RichTextNode[];

// ============================================================================
// Category & Tag
// ============================================================================

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  type: CategoryType;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

// ============================================================================
// Blog
// ============================================================================

/** 博客列表项（不含富文本正文，节省带宽） */
export interface BlogListItem {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverAlt?: string | null;
  /** 预估阅读时长（分钟） */
  readingTime: number;
  viewCount: number;
  /** ISO 8601 date-time */
  publishedAt?: string | null;
  /** ISO 8601 date-time */
  updatedAt: string;
  cover?: StrapiImage | null;
  category?: Category | null;
  tags: Tag[];
}

/** 博客详情（含富文本正文） */
export interface Blog extends BlogListItem {
  content?: RichTextContent | null;
}

// ============================================================================
// Video
// ============================================================================

export interface Video {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  /** B站/YouTube 完整原始 URL */
  videoUrl: string;
  platform: VideoPlatform;
  /** 平台视频 ID，用于生成 iframe src */
  embedId: string;
  /** 视频时长，格式 HH:MM:SS */
  duration?: string | null;
  /** ISO 8601 date-time */
  publishedAt?: string | null;
  /** ISO 8601 date-time */
  updatedAt: string;
  thumbnail?: StrapiImage | null;
  category?: Category | null;
  tags: Tag[];
}

// ============================================================================
// Book
// ============================================================================

export interface Book {
  id: number;
  title: string;
  slug: string;
  author: string;
  publisher?: string | null;
  publishedYear?: number | null;
  isbn?: string | null;
  /** 简评，列表页展示 */
  shortReview?: string | null;
  /** 读书笔记富文本 */
  notes?: RichTextContent | null;
  rating?: BookRating | null;
  /** ISO 8601 date-time */
  publishedAt?: string | null;
  /** ISO 8601 date-time */
  updatedAt: string;
  cover?: StrapiImage | null;
  category?: Category | null;
  tags: Tag[];
}

// ============================================================================
// Global
// ============================================================================

export interface Global {
  id: number;
  siteName: string;
  tagline?: string | null;
  githubUrl?: string | null;
  twitterUrl?: string | null;
  weiboUrl?: string | null;
  bilibiliUrl?: string | null;
  email?: string | null;
  footerText?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  avatar?: StrapiImage | null;
}

// ============================================================================
// Pagination & Response Wrappers
// ============================================================================

export interface PaginationMeta {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface StrapiListResponse<T> {
  data: T[];
  meta: {
    pagination: PaginationMeta;
  };
}

export interface StrapiSingleResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

export type BlogListResponse   = StrapiListResponse<BlogListItem>;
export type BlogDetailResponse = StrapiListResponse<Blog>;
export type VideoListResponse  = StrapiListResponse<Video>;
export type BookListResponse   = StrapiListResponse<Book>;
export type CategoryListResponse = StrapiListResponse<Category>;
export type TagListResponse    = StrapiListResponse<Tag>;
export type GlobalResponse     = StrapiSingleResponse<Global>;

// ============================================================================
// Request Query Param Types
// ============================================================================

export interface GetBlogsRequest {
  "pagination[page]"?: number;
  "pagination[pageSize]"?: number;
  sort?: string;
  "filters[category][slug][$eq]"?: string;
  "filters[tags][slug][$eq]"?: string;
  "status"?: "published" | "draft";
}

export interface GetBlogBySlugRequest {
  slug: string;
}

export interface GetVideosRequest {
  "pagination[page]"?: number;
  "pagination[pageSize]"?: number;
  sort?: string;
  "filters[category][slug][$eq]"?: string;
  "filters[tags][slug][$eq]"?: string;
  "filters[platform][$eq]"?: VideoPlatform;
}

export interface GetVideoBySlugRequest {
  slug: string;
}

export interface GetBooksRequest {
  "pagination[page]"?: number;
  "pagination[pageSize]"?: number;
  sort?: string;
  "filters[category][slug][$eq]"?: string;
  "filters[tags][slug][$eq]"?: string;
  "filters[rating][$gte]"?: number;
}

export interface GetBookBySlugRequest {
  slug: string;
}

export interface GetCategoriesRequest {
  "filters[type][$eq]"?: CategoryType;
}

// ============================================================================
// Type Guards
// ============================================================================

export function isStrapiImage(value: unknown): value is StrapiImage {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof (value as any).id === "number" &&
    "url" in value &&
    typeof (value as any).url === "string" &&
    "mime" in value &&
    typeof (value as any).mime === "string"
  );
}

export function isCategory(value: unknown): value is Category {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof (value as any).id === "number" &&
    "name" in value &&
    typeof (value as any).name === "string" &&
    "slug" in value &&
    typeof (value as any).slug === "string" &&
    "type" in value &&
    (["blog", "video", "book", "general"] as string[]).includes((value as any).type)
  );
}

export function isTag(value: unknown): value is Tag {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof (value as any).id === "number" &&
    "name" in value &&
    typeof (value as any).name === "string" &&
    "slug" in value &&
    typeof (value as any).slug === "string"
  );
}

export function isBlogListItem(value: unknown): value is BlogListItem {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof (value as any).id === "number" &&
    "title" in value &&
    typeof (value as any).title === "string" &&
    "slug" in value &&
    typeof (value as any).slug === "string" &&
    (["draft", "published", "archived"] as string[]).includes((value as any).status)
  );
}

export function isBlog(value: unknown): value is Blog {
  return isBlogListItem(value);
}

export function isVideo(value: unknown): value is Video {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof (value as any).id === "number" &&
    "title" in value &&
    typeof (value as any).title === "string" &&
    "slug" in value &&
    typeof (value as any).slug === "string" &&
    "videoUrl" in value &&
    typeof (value as any).videoUrl === "string" &&
    "platform" in value &&
    (["bilibili", "youtube", "other"] as string[]).includes((value as any).platform) &&
    "embedId" in value &&
    typeof (value as any).embedId === "string"
  );
}

export function isBook(value: unknown): value is Book {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof (value as any).id === "number" &&
    "title" in value &&
    typeof (value as any).title === "string" &&
    "slug" in value &&
    typeof (value as any).slug === "string" &&
    "author" in value &&
    typeof (value as any).author === "string"
  );
}

export function isGlobal(value: unknown): value is Global {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof (value as any).id === "number" &&
    "siteName" in value &&
    typeof (value as any).siteName === "string"
  );
}

export function isStrapiListResponse<T>(
  value: unknown,
  itemGuard: (item: unknown) => item is T
): value is StrapiListResponse<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    Array.isArray((value as any).data) &&
    (value as any).data.every(itemGuard) &&
    "meta" in value
  );
}

// ============================================================================
// Error Types
// ============================================================================

export interface ApiError {
  status: number;
  error: string;
  detail?: string | null;
}

export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as any).status === "number" &&
    "error" in value &&
    typeof (value as any).error === "string"
  );
}
