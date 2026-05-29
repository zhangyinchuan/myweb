-- Migration: 20260529000005_create_books.sql
-- Description: 创建书籍表及书籍-标签关联表

-- UP
BEGIN;

CREATE TABLE IF NOT EXISTS books (
  id             BIGSERIAL PRIMARY KEY,
  title          VARCHAR(255)  NOT NULL,
  slug           VARCHAR(280)  NOT NULL UNIQUE,
  author         VARCHAR(255)  NOT NULL,
  publisher      VARCHAR(255),
  published_year SMALLINT      CHECK (published_year BETWEEN 1000 AND 2100),
  isbn           VARCHAR(20)   UNIQUE,
  short_review   TEXT,
  notes          JSONB,
  rating         SMALLINT      CHECK (rating BETWEEN 1 AND 5),
  status         VARCHAR(20)   NOT NULL DEFAULT 'draft'
                   CHECK (status IN ('draft', 'published', 'archived')),
  published_at   TIMESTAMPTZ,
  created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  created_by_id  BIGINT,
  updated_by_id  BIGINT,
  cover_id       BIGINT REFERENCES upload_files(id) ON DELETE SET NULL,
  category_id    BIGINT REFERENCES categories(id)   ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_books_slug      ON books(slug);
CREATE INDEX IF NOT EXISTS idx_books_status    ON books(status);
CREATE INDEX IF NOT EXISTS idx_books_published ON books(published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_books_author    ON books(author);
CREATE INDEX IF NOT EXISTS idx_books_rating    ON books(rating);
CREATE INDEX IF NOT EXISTS idx_books_category  ON books(category_id);
CREATE INDEX IF NOT EXISTS idx_books_notes_gin ON books USING GIN(notes);

CREATE TABLE IF NOT EXISTS books_tags_links (
  id        BIGSERIAL PRIMARY KEY,
  book_id   BIGINT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  tag_id    BIGINT NOT NULL REFERENCES tags(id)  ON DELETE CASCADE,
  tag_order DOUBLE PRECISION,
  UNIQUE (book_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_books_tags_book ON books_tags_links(book_id);
CREATE INDEX IF NOT EXISTS idx_books_tags_tag  ON books_tags_links(tag_id);

COMMIT;

-- DOWN
BEGIN;
DROP INDEX IF EXISTS idx_books_tags_tag;
DROP INDEX IF EXISTS idx_books_tags_book;
DROP TABLE IF EXISTS books_tags_links;

DROP INDEX IF EXISTS idx_books_notes_gin;
DROP INDEX IF EXISTS idx_books_category;
DROP INDEX IF EXISTS idx_books_rating;
DROP INDEX IF EXISTS idx_books_author;
DROP INDEX IF EXISTS idx_books_published;
DROP INDEX IF EXISTS idx_books_status;
DROP INDEX IF EXISTS idx_books_slug;
DROP TABLE IF EXISTS books;
COMMIT;
