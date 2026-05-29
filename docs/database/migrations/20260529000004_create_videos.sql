-- Migration: 20260529000004_create_videos.sql
-- Description: 创建视频表及视频-标签关联表

-- UP
BEGIN;

CREATE TABLE IF NOT EXISTS videos (
  id            BIGSERIAL PRIMARY KEY,
  title         VARCHAR(255)  NOT NULL,
  slug          VARCHAR(280)  NOT NULL UNIQUE,
  description   TEXT,
  video_url     VARCHAR(2048) NOT NULL,
  platform      VARCHAR(20)   NOT NULL
                  CHECK (platform IN ('bilibili', 'youtube', 'other')),
  embed_id      VARCHAR(255)  NOT NULL,
  duration      VARCHAR(20),
  status        VARCHAR(20)   NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft', 'published', 'archived')),
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  created_by_id BIGINT,
  updated_by_id BIGINT,
  thumbnail_id  BIGINT REFERENCES upload_files(id) ON DELETE SET NULL,
  category_id   BIGINT REFERENCES categories(id)   ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_videos_slug      ON videos(slug);
CREATE INDEX IF NOT EXISTS idx_videos_status    ON videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_published ON videos(published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_videos_platform  ON videos(platform);
CREATE INDEX IF NOT EXISTS idx_videos_category  ON videos(category_id);

CREATE TABLE IF NOT EXISTS videos_tags_links (
  id        BIGSERIAL PRIMARY KEY,
  video_id  BIGINT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  tag_id    BIGINT NOT NULL REFERENCES tags(id)   ON DELETE CASCADE,
  tag_order DOUBLE PRECISION,
  UNIQUE (video_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_videos_tags_video ON videos_tags_links(video_id);
CREATE INDEX IF NOT EXISTS idx_videos_tags_tag   ON videos_tags_links(tag_id);

COMMIT;

-- DOWN
BEGIN;
DROP INDEX IF EXISTS idx_videos_tags_tag;
DROP INDEX IF EXISTS idx_videos_tags_video;
DROP TABLE IF EXISTS videos_tags_links;

DROP INDEX IF EXISTS idx_videos_category;
DROP INDEX IF EXISTS idx_videos_platform;
DROP INDEX IF EXISTS idx_videos_published;
DROP INDEX IF EXISTS idx_videos_status;
DROP INDEX IF EXISTS idx_videos_slug;
DROP TABLE IF EXISTS videos;
COMMIT;
