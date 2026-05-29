-- Migration: 20260529000003_create_blogs.sql
-- Description: 创建博客文章表及博客-标签关联表

-- UP
BEGIN;

CREATE TABLE IF NOT EXISTS blogs (
  id            BIGSERIAL PRIMARY KEY,
  title         VARCHAR(255)  NOT NULL,
  slug          VARCHAR(280)  NOT NULL UNIQUE,
  excerpt       TEXT,
  content       JSONB,
  cover_alt     VARCHAR(255),
  reading_time  SMALLINT      DEFAULT 0,
  view_count    INT           NOT NULL DEFAULT 0,
  status        VARCHAR(20)   NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft', 'published', 'archived')),
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  created_by_id BIGINT,
  updated_by_id BIGINT,
  cover_id      BIGINT REFERENCES upload_files(id) ON DELETE SET NULL,
  category_id   BIGINT REFERENCES categories(id)   ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_blogs_slug      ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_status    ON blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_blogs_category  ON blogs(category_id);
CREATE INDEX IF NOT EXISTS idx_blogs_content_gin ON blogs USING GIN(content);

CREATE TABLE IF NOT EXISTS blogs_tags_links (
  id         BIGSERIAL PRIMARY KEY,
  blog_id    BIGINT NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  tag_id     BIGINT NOT NULL REFERENCES tags(id)  ON DELETE CASCADE,
  tag_order  DOUBLE PRECISION,
  UNIQUE (blog_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_blogs_tags_blog ON blogs_tags_links(blog_id);
CREATE INDEX IF NOT EXISTS idx_blogs_tags_tag  ON blogs_tags_links(tag_id);

COMMIT;

-- DOWN
BEGIN;
DROP INDEX IF EXISTS idx_blogs_tags_tag;
DROP INDEX IF EXISTS idx_blogs_tags_blog;
DROP TABLE IF EXISTS blogs_tags_links;

DROP INDEX IF EXISTS idx_blogs_content_gin;
DROP INDEX IF EXISTS idx_blogs_category;
DROP INDEX IF EXISTS idx_blogs_published;
DROP INDEX IF EXISTS idx_blogs_status;
DROP INDEX IF EXISTS idx_blogs_slug;
DROP TABLE IF EXISTS blogs;
COMMIT;
