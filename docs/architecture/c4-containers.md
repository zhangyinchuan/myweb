# C4 Level 2 — Container Diagram

> 展示个人网站系统内部各可部署容器及其交互关系。面向技术架构师和开发者。

```mermaid
C4Container
  title Container Diagram — 个人网站

  Person(visitor, "访客", "浏览内容的普通大众")
  Person(owner, "站长", "内容管理者")

  System_Ext(bilibili, "B站 / YouTube", "外部视频平台")
  System_Ext(aliyunOSS, "阿里云 OSS", "媒体文件存储 / CDN")

  System_Boundary(personalSite, "个人网站系统（阿里云 ECS）") {

    Container(nginx, "Nginx", "Nginx 1.24", "反向代理，统一 80/443 入口，路由到前端或 Strapi API")

    Container(nextjs, "Next.js 前端", "Next.js 14 / TypeScript / Tailwind CSS", "SSG + ISR 渲染，提供首页、博客、视频、书籍四大板块页面")

    Container(strapi, "Strapi CMS", "Strapi v4 / Node.js", "Headless CMS，提供内容管理后台（/admin）与 REST API（/api）")

    ContainerDb(postgres, "PostgreSQL", "PostgreSQL 15", "存储博客、视频、书籍、全局配置等所有内容数据")

  }

  Rel(visitor, nginx, "访问网站", "HTTPS :443")
  Rel(owner, nginx, "登录 CMS 后台", "HTTPS :443")

  Rel(nginx, nextjs, "转发前端请求", "HTTP :3000")
  Rel(nginx, strapi, "转发 /api 及 /admin 请求", "HTTP :1337")

  Rel(nextjs, strapi, "获取内容数据（ISR）", "REST API / HTTP")
  Rel(nextjs, aliyunOSS, "加载封面图、头像等媒体", "HTTPS / CDN")
  Rel(nextjs, bilibili, "嵌入视频播放器", "iframe / HTTPS")

  Rel(strapi, postgres, "读写内容数据", "SQL / TCP :5432")
  Rel(strapi, aliyunOSS, "上传媒体文件", "OSS SDK / HTTPS")

  UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

## 容器说明

| 容器 | 技术 | 职责 |
|---|---|---|
| Nginx | Nginx 1.24 | 唯一对外入口，处理 SSL 终止，按路径路由到 Next.js（默认）或 Strapi（`/api`、`/admin`、`/uploads`） |
| Next.js 前端 | Next.js 14 + TypeScript | 页面渲染引擎；使用 ISR（revalidate 60s）保证内容时效性；Tailwind CSS + Framer Motion 实现 Apple 式视觉 |
| Strapi CMS | Strapi v4 + Node.js | 内容管理后台 + REST API 服务；内容类型：Blog、Video、Book、Global |
| PostgreSQL | PostgreSQL 15 | 持久化所有结构化内容数据，仅 Strapi 内部访问 |

## 端口分配

| 服务 | 内部端口 | 对外暴露 |
|---|---|---|
| Nginx | 80 / 443 | ✅ 公网 |
| Next.js | 3000 | ❌ 仅内网（Nginx 代理） |
| Strapi | 1337 | ❌ 仅内网（Nginx 代理） |
| PostgreSQL | 5432 | ❌ 仅本机 |
