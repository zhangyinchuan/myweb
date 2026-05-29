# 个人网站 — 数据库文档索引

> 数据库：PostgreSQL 15，由 Strapi v4 管理。

## 文档目录

| 文件 | 内容 |
|---|---|
| [schema.md](./schema.md) | 完整 DDL、表关系说明、索引策略、核心查询示例 |
| [migrations/](./migrations/) | 按时间戳排序的可逆迁移脚本 |

## 迁移执行顺序

```
20260529000001_create_categories.sql   → categories
20260529000002_create_tags.sql         → tags
20260529000003_create_blogs.sql        → blogs + blogs_tags_links
20260529000004_create_videos.sql       → videos + videos_tags_links
20260529000005_create_books.sql        → books + books_tags_links
20260529000006_create_globals.sql      → globals（单例，含默认行）
```

> **注意：** `blogs`、`videos`、`books` 表依赖 Strapi 内置的 `upload_files` 表（`cover_id`、`thumbnail_id` 外键），需确保 Strapi 先完成初始化再执行这三张表的迁移。

## 表概览

| 表 | 行数量级 | 主要用途 |
|---|---|---|
| `categories` | < 100 | 内容分类，区分 blog/video/book |
| `tags` | < 500 | 内容标签，跨模块通用 |
| `blogs` | 数百~数千 | 博客文章，含富文本 JSONB |
| `videos` | 数百 | 视频推荐，存平台 ID 用于 iframe |
| `books` | 数百 | 书籍推荐，含读书笔记 JSONB |
| `blogs_tags_links` | 与 blogs 同量级 | 博客-标签 M:N 关联 |
| `videos_tags_links` | 与 videos 同量级 | 视频-标签 M:N 关联 |
| `books_tags_links` | 与 books 同量级 | 书籍-标签 M:N 关联 |
| `upload_files` | 数百~数千 | 媒体文件元数据（Strapi 管理） |
| `globals` | 1（单例） | 站点全局配置 |

## 关键设计决策

**JSONB 存储富文本**：`blogs.content` 和 `books.notes` 使用 JSONB 存储 Strapi Blocks 格式，便于前端直接消费，同时支持 GIN 索引预留全文检索能力。

**Partial Index 优化列表查询**：所有内容表的 `published_at` 索引均加 `WHERE status = 'published'` 过滤条件，减少索引体积，加速前端最常见的"已发布内容排序"查询。

**单例约束**：`globals` 表通过 `CREATE UNIQUE INDEX ON globals((TRUE))` 强制只允许一行，防止误插入多条全局配置。

**标签通用化**：`tags` 表不区分模块，通过各模块的 `*_tags_links` 关联表实现跨模块标签复用（同一标签可同时用于博客和书籍）。

---

*文档生成时间：2026-05-29 | 对应 PRD 版本：1.0*
