-- Migration: 20260529000006_create_globals.sql
-- Description: 创建全局配置单例表

-- UP
BEGIN;

CREATE TABLE IF NOT EXISTS globals (
  id              BIGSERIAL PRIMARY KEY,
  site_name       VARCHAR(100)  NOT NULL DEFAULT '我的个人网站',
  tagline         VARCHAR(255),
  github_url      VARCHAR(2048),
  twitter_url     VARCHAR(2048),
  weibo_url       VARCHAR(2048),
  bilibili_url    VARCHAR(2048),
  email           VARCHAR(255)  CHECK (email ~* '^[^@]+@[^@]+\.[^@]+$'),
  footer_text     VARCHAR(500),
  seo_title       VARCHAR(100),
  seo_description VARCHAR(255),
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  created_by_id   BIGINT,
  updated_by_id   BIGINT,
  avatar_id       BIGINT REFERENCES upload_files(id) ON DELETE SET NULL
);

-- 确保只有一行（单例约束）
CREATE UNIQUE INDEX IF NOT EXISTS idx_globals_singleton ON globals((TRUE));

-- 插入默认行
INSERT INTO globals (site_name, tagline)
VALUES ('我的个人网站', '记录思考，分享所得')
ON CONFLICT DO NOTHING;

COMMIT;

-- DOWN
BEGIN;
DROP INDEX IF EXISTS idx_globals_singleton;
DROP TABLE IF EXISTS globals;
COMMIT;
