-- Migration: 20260529000002_create_tags.sql
-- Description: 创建标签表

-- UP
BEGIN;

CREATE TABLE IF NOT EXISTS tags (
  id            BIGSERIAL PRIMARY KEY,
  name          VARCHAR(80)   NOT NULL,
  slug          VARCHAR(100)  NOT NULL UNIQUE,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  created_by_id BIGINT,
  updated_by_id BIGINT
);

CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);

COMMIT;

-- DOWN
BEGIN;
DROP INDEX IF EXISTS idx_tags_slug;
DROP TABLE IF EXISTS tags;
COMMIT;
