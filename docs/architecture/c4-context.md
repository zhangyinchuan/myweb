# C4 Level 1 — System Context

> 展示个人网站系统与外部参与者及外部系统之间的关系。面向所有人（含非技术受众）。

```mermaid
C4Context
  title System Context — 个人网站

  Person(visitor, "访客", "对博客、视频、书籍内容感兴趣的普通大众")
  Person(owner, "站长", "网站所有者，负责发布和管理内容")

  System(personalSite, "个人网站", "综合型内容展示平台，包含首页、博客、视频分享、书籍分享四大板块")

  System_Ext(strapi, "Strapi CMS", "Headless CMS，提供内容管理后台与 REST API")
  System_Ext(bilibili, "B站 / YouTube", "外部视频平台，提供视频嵌入播放器")
  System_Ext(aliyunOSS, "阿里云 OSS", "对象存储，托管封面图、头像等媒体文件")

  Rel(visitor, personalSite, "浏览内容", "HTTPS")
  Rel(owner, strapi, "登录后台，发布/编辑内容", "HTTPS")
  Rel(personalSite, strapi, "拉取内容数据", "REST API / HTTPS")
  Rel(personalSite, bilibili, "嵌入视频播放器", "iframe / HTTPS")
  Rel(personalSite, aliyunOSS, "加载媒体文件", "HTTPS / CDN")
  Rel(strapi, aliyunOSS, "上传媒体文件", "OSS SDK")

  UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

## 说明

| 参与者 / 系统 | 角色 |
|---|---|
| 访客 | 网站的主要读者，无需登录即可访问所有内容 |
| 站长 | 唯一内容管理者，通过 Strapi 后台发布文章、视频、书籍 |
| 个人网站 | Next.js 前端，负责页面渲染与内容展示 |
| Strapi CMS | 自托管 Headless CMS，数据存储于 PostgreSQL，提供 REST API |
| B站 / YouTube | 外部视频平台，网站以 iframe 形式嵌入，不自托管视频 |
| 阿里云 OSS | 媒体文件存储，Strapi 上传后由前端直接通过 CDN 加载 |
