# C4 Level 3 — Component Diagram: Next.js 前端

> 展示 Next.js 前端容器内部的核心组件及其交互。面向开发者。

```mermaid
C4Component
  title Component Diagram — Next.js 前端

  Container_Ext(strapi, "Strapi CMS", "REST API", "提供内容数据")
  Container_Ext(aliyunOSS, "阿里云 OSS", "CDN", "媒体文件")
  Container_Ext(bilibili, "B站 / YouTube", "iframe", "视频播放器")

  Container_Boundary(nextjs, "Next.js 前端") {

    Component(appRouter, "App Router", "Next.js App Router", "管理页面路由：/、/blog、/blog/[slug]、/videos、/videos/[slug]、/books、/books/[slug]")

    Component(homePage, "首页 (HomePage)", "React Server Component", "Hero 区 + 最新博客预览（3-6篇）+ 最新视频分享（3-6个）")

    Component(blogModule, "博客模块 (BlogModule)", "React Server/Client Components", "博客列表页（分类/标签筛选）+ 博客详情页（富文本渲染）")

    Component(videoModule, "视频模块 (VideoModule)", "React Server/Client Components", "视频列表页（分类/标签筛选）+ 视频详情页（嵌入播放器）")

    Component(bookModule, "书籍模块 (BookModule)", "React Server/Client Components", "书籍列表页（分类/标签筛选）+ 书籍详情页（读书笔记）")

    Component(uiComponents, "UI 组件库 (UIComponents)", "React Components / Tailwind CSS / Framer Motion", "Navbar、Footer、Card、Tag、FilterBar、Hero 等共享组件")

    Component(strapiClient, "Strapi API Client (strapiClient)", "TypeScript / fetch", "封装 Strapi REST API 调用；支持 ISR revalidate；统一错误处理")

    Component(imageLoader, "图片加载器 (imageLoader)", "next/image / OSS", "优化图片加载，配置阿里云 OSS 为 next/image 远程域名")

  }

  Rel(appRouter, homePage, "渲染首页路由 /")
  Rel(appRouter, blogModule, "渲染博客路由 /blog/*")
  Rel(appRouter, videoModule, "渲染视频路由 /videos/*")
  Rel(appRouter, bookModule, "渲染书籍路由 /books/*")

  Rel(homePage, strapiClient, "请求最新博客、视频数据")
  Rel(blogModule, strapiClient, "请求文章列表、分类、标签、详情")
  Rel(videoModule, strapiClient, "请求视频列表、分类、标签、详情")
  Rel(bookModule, strapiClient, "请求书籍列表、分类、标签、详情")

  Rel(homePage, uiComponents, "使用 Card、Hero 等组件")
  Rel(blogModule, uiComponents, "使用 Card、Tag、FilterBar 等组件")
  Rel(videoModule, uiComponents, "使用 Card、Tag、FilterBar 等组件")
  Rel(bookModule, uiComponents, "使用 Card、Tag、FilterBar 等组件")

  Rel(strapiClient, strapi, "REST API 请求", "HTTP / revalidate 60s")
  Rel(imageLoader, aliyunOSS, "加载媒体文件", "HTTPS / CDN")
  Rel(videoModule, bilibili, "嵌入视频 iframe", "HTTPS")

  UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

## 组件说明

| 组件 | 类型 | 核心职责 |
|---|---|---|
| App Router | 路由层 | Next.js 14 App Router，定义所有页面路由和布局（`layout.tsx`） |
| HomePage | Server Component | 首页聚合展示，构建时通过 ISR 预渲染 |
| BlogModule | Server + Client | 列表页为 Server Component（SEO）；筛选栏为 Client Component（交互） |
| VideoModule | Server + Client | 同 BlogModule，视频详情页动态加载 iframe（避免 SSR 报错） |
| BookModule | Server + Client | 书籍列表 Server Component + 详情页富文本渲染 |
| UIComponents | 纯展示组件 | 设计系统组件库，无业务逻辑，支持 Tailwind 主题 Token |
| strapiClient | 服务层 | 唯一与 Strapi API 通信的模块，集中管理 API Token 和 revalidate 配置 |
| imageLoader | 工具层 | 配置 `next/image` 远程域名白名单（OSS 域名），提供统一图片优化 |

## 渲染策略

| 页面 | 策略 | revalidate |
|---|---|---|
| 首页 `/` | ISR | 60s |
| 博客列表 `/blog` | ISR | 60s |
| 博客详情 `/blog/[slug]` | ISR | 60s |
| 视频列表 `/videos` | ISR | 60s |
| 视频详情 `/videos/[slug]` | ISR | 60s |
| 书籍列表 `/books` | ISR | 60s |
| 书籍详情 `/books/[slug]` | ISR | 60s |
