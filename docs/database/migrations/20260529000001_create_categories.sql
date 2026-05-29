-- Migration: 20260529000001_create_categories.sql
-- Description: 创建分类表

-- UP
BEGIN;

CREATE TABLE IF NOT EXISTS categories (
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

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type);

COMMIT;

-- DOWN
BEGIN;
DROP INDEX IF EXISTS idx_categories_type;
DROP INDEX IF EXISTS idx_categories_slug;
DROP TABLE IF EXISTS categories;
COMMIT;
