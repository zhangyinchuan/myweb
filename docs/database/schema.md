# 个人网站 — PostgreSQL 数据库 Schema

> 数据库：PostgreSQL 15，由 Strapi v4 管理。以下 DDL 同时覆盖 Strapi 自动生成的表结构与关键业务表，便于理解数据模型。

---

## 一、实体关系概览（ER 文字描述）

```
categories ──< blogs >──< blog_tags >── tags
                          blogs ──< blog_components (富文本块)

categories ──< videos >──< video_tags >── tags

categories ──< books >──< book_tags >── tags

upload_files (媒体文件) ── 被 blogs / videos / books 引用（通过 upload_files_related_morphs）

global (全局配置，单例)
```

---

## 二、完整 DDL

### 2.1 分类表 `categories`

```sql
CREATE TABLE categories (
  id            BIGSERIAL PRIMARY KEY,
  name          VARCHAR(100)  NOT NULL,
  slug          VARCHAR(120)  NOT NULL UNIQUE,
  description   TEXT,
  type          VARCHAR(20)   NOT NULL CHECK (type IN ('blog', 'video', 'book', 'general')),
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  published_at  TIMESTAMPTZ,
  created_by_id BIGINT,
  updated_by_id BIGINT
);

CREATE INDEX idx_categories_slug  ON categories(slug);
CREATE INDEX idx_categories_type  ON categories(type);
```

**说明：** `type` 字段区分该分类属于哪个内容模块（blog/video/book），避免跨模块混用。

---

### 2.2 标签表 `tags`

```sql
CREATE TABLE tags (
  id            BIGSERIAL PRIMARY KEY,
  name          VARCHAR(80)   NOT NULL,
  slug          VARCHAR(100)  NOT NULL UNIQUE,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  created_by_id BIGINT,
  updated_by_id BIGINT
);

CREATE INDEX idx_tags_slug ON tags(slug);
```

---

### 2.3 博客文章表 `blogs`

```sql
CREATE TABLE blogs (
  id            BIGSERIAL PRIMARY KEY,
  title         VARCHAR(255)  NOT NULL,
  slug          VARCHAR(280)  NOT NULL UNIQUE,
  excerpt       TEXT,                           -- 摘要，首页/列表预览用
  content       JSONB,                          -- 富文本（Strapi Blocks 格式）
  cover_alt     VARCHAR(255),                   -- 封面图 alt 文本
  reading_time  SMALLINT      DEFAULT 0,        -- 预估阅读时长（分钟）
  view_count    INT           NOT NULL DEFAULT 0,
  status        VARCHAR(20)   NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft', 'published', 'archived')),
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  created_by_id BIGINT,
  updated_by_id BIGINT,
  -- FK: 封面图
  cover_id      BIGINT REFERENCES upload_files(id) ON DELETE SET NULL,
  -- FK: 分类（多对一）
  category_id   BIGINT REFERENCES categories(id) ON DELETE SET NULL
);

CREATE INDEX idx_blogs_slug        ON blogs(slug);
CREATE INDEX idx_blogs_status      ON blogs(status);
CREATE INDEX idx_blogs_published   ON blogs(published_at DESC) WHERE status = 'published';
CREATE INDEX idx_blogs_category    ON blogs(category_id);
CREATE INDEX idx_blogs_content_gin ON blogs USING GIN(content);  -- 全文检索预留
```

---

### 2.4 博客-标签关联表 `blogs_tags_links`

```sql
CREATE TABLE blogs_tags_links (
  id       BIGSERIAL PRIMARY KEY,
  blog_id  BIGINT NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  tag_id   BIGINT NOT NULL REFERENCES tags(id)  ON DELETE CASCADE,
  tag_order DOUBLE PRECISION,
  UNIQUE (blog_id, tag_id)
);

CREATE INDEX idx_blogs_tags_blog ON blogs_tags_links(blog_id);
CREATE INDEX idx_blogs_tags_tag  ON blogs_tags_links(tag_id);
```

---

### 2.5 视频表 `videos`

```sql
CREATE TABLE videos (
  id            BIGSERIAL PRIMARY KEY,
  title         VARCHAR(255)  NOT NULL,
  slug          VARCHAR(280)  NOT NULL UNIQUE,
  description   TEXT,
  video_url     VARCHAR(2048) NOT NULL,          -- B站/YouTube 完整 URL
  platform      VARCHAR(20)   NOT NULL
                  CHECK (platform IN ('bilibili', 'youtube', 'other')),
  embed_id      VARCHAR(255)  NOT NULL,          -- 平台视频 ID（用于生成 iframe）
  duration      VARCHAR(20),                     -- 时长，格式 HH:MM:SS
  status        VARCHAR(20)   NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft', 'published', 'archived')),
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  created_by_id BIGINT,
  updated_by_id BIGINT,
  -- FK: 缩略图
  thumbnail_id  BIGINT REFERENCES upload_files(id) ON DELETE SET NULL,
  -- FK: 分类
  category_id   BIGINT REFERENCES categories(id) ON DELETE SET NULL
);

CREATE INDEX idx_videos_slug      ON videos(slug);
CREATE INDEX idx_videos_status    ON videos(status);
CREATE INDEX idx_videos_published ON videos(published_at DESC) WHERE status = 'published';
CREATE INDEX idx_videos_platform  ON videos(platform);
CREATE INDEX idx_videos_category  ON videos(category_id);
```

---

### 2.6 视频-标签关联表 `videos_tags_links`

```sql
CREATE TABLE videos_tags_links (
  id         BIGSERIAL PRIMARY KEY,
  video_id   BIGINT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  tag_id     BIGINT NOT NULL REFERENCES tags(id)   ON DELETE CASCADE,
  tag_order  DOUBLE PRECISION,
  UNIQUE (video_id, tag_id)
);

CREATE INDEX idx_videos_tags_video ON videos_tags_links(video_id);
CREATE INDEX idx_videos_tags_tag   ON videos_tags_links(tag_id);
```

---

### 2.7 书籍表 `books`

```sql
CREATE TABLE books (
  id            BIGSERIAL PRIMARY KEY,
  title         VARCHAR(255)  NOT NULL,
  slug          VARCHAR(280)  NOT NULL UNIQUE,
  author        VARCHAR(255)  NOT NULL,
  publisher     VARCHAR(255),
  published_year SMALLINT     CHECK (published_year BETWEEN 1000 AND 2100),
  isbn          VARCHAR(20)   UNIQUE,
  short_review  TEXT,                            -- 简评（列表页展示）
  notes         JSONB,                           -- 读书笔记富文本（Strapi Blocks 格式）
  rating        SMALLINT      CHECK (rating BETWEEN 1 AND 5),
  status        VARCHAR(20)   NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft', 'published', 'archived')),
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  created_by_id BIGINT,
  updated_by_id BIGINT,
  -- FK: 书籍封面
  cover_id      BIGINT REFERENCES upload_files(id) ON DELETE SET NULL,
  -- FK: 分类
  category_id   BIGINT REFERENCES categories(id) ON DELETE SET NULL
);

CREATE INDEX idx_books_slug      ON books(slug);
CREATE INDEX idx_books_status    ON books(status);
CREATE INDEX idx_books_published ON books(published_at DESC) WHERE status = 'published';
CREATE INDEX idx_books_author    ON books(author);
CREATE INDEX idx_books_rating    ON books(rating);
CREATE INDEX idx_books_category  ON books(category_id);
CREATE INDEX idx_books_notes_gin ON books USING GIN(notes);  -- 全文检索预留
```

---

### 2.8 书籍-标签关联表 `books_tags_links`

```sql
CREATE TABLE books_tags_links (
  id        BIGSERIAL PRIMARY KEY,
  book_id   BIGINT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  tag_id    BIGINT NOT NULL REFERENCES tags(id)  ON DELETE CASCADE,
  tag_order DOUBLE PRECISION,
  UNIQUE (book_id, tag_id)
);

CREATE INDEX idx_books_tags_book ON books_tags_links(book_id);
CREATE INDEX idx_books_tags_tag  ON books_tags_links(tag_id);
```

---

### 2.9 媒体文件表 `upload_files`（Strapi 内置）

```sql
-- Strapi 自动创建，此处仅展示关键字段
CREATE TABLE upload_files (
  id            BIGSERIAL PRIMARY KEY,
  name          VARCHAR(255)  NOT NULL,
  alternative_text VARCHAR(255),
  caption       VARCHAR(255),
  width         INT,
  height        INT,
  formats       JSONB,                           -- 多尺寸缩略图 URL
  hash          VARCHAR(255)  NOT NULL,
  ext           VARCHAR(20),
  mime          VARCHAR(255)  NOT NULL,
  size          DECIMAL(10, 2) NOT NULL,         -- KB
  url           VARCHAR(2048) NOT NULL,          -- OSS CDN URL
  preview_url   VARCHAR(2048),
  provider      VARCHAR(255)  NOT NULL,          -- 'aws-s3' / '@strapi/provider-upload-ali-oss'
  provider_metadata JSONB,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  created_by_id BIGINT,
  updated_by_id BIGINT
);

CREATE INDEX idx_upload_files_hash ON upload_files(hash);
```

---

### 2.10 全局配置表 `globals`（单例）

```sql
CREATE TABLE globals (
  id              BIGSERIAL PRIMARY KEY,
  site_name       VARCHAR(100)  NOT NULL DEFAULT '我的个人网站',
  tagline         VARCHAR(255),                  -- Hero 区一句话简介
  avatar_id       BIGINT REFERENCES upload_files(id) ON DELETE SET NULL,
  github_url      VARCHAR(2048),
  twitter_url     VARCHAR(2048),
  weibo_url       VARCHAR(2048),
  bilibili_url    VARCHAR(2048),
  email           VARCHAR(255),
  footer_text     VARCHAR(500),
  seo_title       VARCHAR(100),
  seo_description VARCHAR(255),
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  created_by_id   BIGINT,
  updated_by_id   BIGINT
);

-- 单例表，确保只有一行
CREATE UNIQUE INDEX idx_globals_singleton ON globals((TRUE));
```

---

## 三、表关系总览

```
tags (N) ──< blogs_tags_links >── (N) blogs
tags (N) ──< videos_tags_links >── (N) videos
tags (N) ──< books_tags_links >── (N) books

categories (1) ──< (N) blogs
categories (1) ──< (N) videos
categories (1) ──< (N) books

upload_files (1) ──< (1) blogs.cover_id
upload_files (1) ──< (1) videos.thumbnail_id
upload_files (1) ──< (1) books.cover_id
upload_files (1) ──< (1) globals.avatar_id
```

---

## 四、索引策略汇总

| 表 | 索引列 | 类型 | 目的 |
|---|---|---|---|
| `categories` | `slug` | B-Tree UNIQUE | 按 slug 查分类 |
| `categories` | `type` | B-Tree | 按模块过滤分类 |
| `tags` | `slug` | B-Tree UNIQUE | 按 slug 查标签 |
| `blogs` | `slug` | B-Tree UNIQUE | 按 slug 查详情（ISR） |
| `blogs` | `status, published_at` | B-Tree Partial | 列表页排序（仅已发布） |
| `blogs` | `category_id` | B-Tree | 按分类过滤 |
| `blogs` | `content` | GIN | 全文检索预留 |
| `videos` | `slug` | B-Tree UNIQUE | 详情页路由 |
| `videos` | `platform` | B-Tree | 按平台过滤 |
| `videos` | `status, published_at` | B-Tree Partial | 列表排序 |
| `videos` | `category_id` | B-Tree | 按分类过滤 |
| `books` | `slug` | B-Tree UNIQUE | 详情页路由 |
| `books` | `rating` | B-Tree | 按评分排序/过滤 |
| `books` | `status, published_at` | B-Tree Partial | 列表排序 |
| `books` | `category_id` | B-Tree | 按分类过滤 |
| `books` | `notes` | GIN | 全文检索预留 |
| `*_tags_links` | `(entity_id, tag_id)` | UNIQUE | 防重复关联 |
| `upload_files` | `hash` | B-Tree | 去重检测 |

---

## 五、核心查询示例

### 获取最新已发布博客（首页预览）
```sql
SELECT b.id, b.title, b.slug, b.excerpt, b.published_at, b.reading_time,
       c.name AS category_name, c.slug AS category_slug,
       f.url AS cover_url, f.formats AS cover_formats
FROM blogs b
LEFT JOIN categories c ON b.category_id = c.id
LEFT JOIN upload_files f ON b.cover_id = f.id
WHERE b.status = 'published'
ORDER BY b.published_at DESC
LIMIT 6;
```

### 博客列表 + 标签（带分类筛选）
```sql
SELECT b.id, b.title, b.slug, b.excerpt, b.published_at,
       ARRAY_AGG(t.name ORDER BY btl.tag_order) AS tags
FROM blogs b
LEFT JOIN blogs_tags_links btl ON b.id = btl.blog_id
LEFT JOIN tags t ON btl.tag_id = t.id
WHERE b.status = 'published'
  AND b.category_id = :category_id   -- 可选过滤
GROUP BY b.id
ORDER BY b.published_at DESC
LIMIT 12 OFFSET :offset;
```

### 博客详情 + 标签
```sql
SELECT b.*,
       c.name AS category_name,
       f.url AS cover_url,
       ARRAY_AGG(t.name) AS tags
FROM blogs b
LEFT JOIN categories c ON b.category_id = c.id
LEFT JOIN upload_files f ON b.cover_id = f.id
LEFT JOIN blogs_tags_links btl ON b.id = btl.blog_id
LEFT JOIN tags t ON btl.tag_id = t.id
WHERE b.slug = :slug AND b.status = 'published'
GROUP BY b.id, c.name, f.url;
```

### 按标签筛选书籍
```sql
SELECT bk.id, bk.title, bk.slug, bk.author, bk.short_review, bk.rating,
       f.url AS cover_url
FROM books bk
INNER JOIN books_tags_links btl ON bk.id = btl.book_id
INNER JOIN tags t ON btl.tag_id = t.id
LEFT JOIN upload_files f ON bk.cover_id = f.id
WHERE t.slug = :tag_slug
  AND bk.status = 'published'
ORDER BY bk.published_at DESC;
```
