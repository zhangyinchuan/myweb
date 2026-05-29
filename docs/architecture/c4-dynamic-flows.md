# C4 Dynamic — 关键请求流程

> 展示两个核心场景的请求序列：访客首次访问页面（ISR 缓存命中 & 未命中）以及站长发布新内容后的内容更新流程。

---

## 场景一：访客访问博客详情页（ISR 缓存命中）

```mermaid
C4Dynamic
  title Dynamic — 访客访问博客详情页（缓存命中）

  Person(visitor, "访客", "浏览博客")
  Container(nginx, "Nginx", "反向代理", "统一入口")
  Container(nextjs, "Next.js", "Next.js 14", "ISR 页面服务")
  Container(strapi, "Strapi CMS", "Strapi v4", "内容 REST API")
  ContainerDb(postgres, "PostgreSQL", "PostgreSQL 15", "内容数据库")
  ContainerDb(ossStorage, "阿里云 OSS", "CDN", "媒体文件")

  Rel(visitor, nginx, "1. GET /blog/my-post", "HTTPS")
  Rel(nginx, nextjs, "2. 转发请求", "HTTP :3000")
  Rel(nextjs, visitor, "3. 返回缓存静态 HTML", "HTTP 200（revalidate 未过期）")
  Rel(visitor, ossStorage, "4. 加载封面图", "CDN HTTPS")

  UpdateRelStyle(visitor, nginx, $textColor="#333", $offsetY="-10")
  UpdateRelStyle(nginx, nextjs, $textColor="#333", $offsetY="-10")
  UpdateRelStyle(nextjs, visitor, $textColor="#0066cc", $offsetY="-10")
  UpdateRelStyle(visitor, ossStorage, $textColor="#333", $offsetY="-10")
```

---

## 场景二：访客访问页面（ISR 缓存过期，触发后台重新生成）

```mermaid
C4Dynamic
  title Dynamic — ISR 缓存过期，后台重新生成页面

  Person(visitor, "访客", "浏览博客")
  Container(nginx, "Nginx", "反向代理", "统一入口")
  Container(nextjs, "Next.js", "Next.js 14", "ISR 页面服务")
  Container(strapi, "Strapi CMS", "Strapi v4", "内容 REST API")
  ContainerDb(postgres, "PostgreSQL", "PostgreSQL 15", "内容数据库")

  Rel(visitor, nginx, "1. GET /blog/my-post", "HTTPS")
  Rel(nginx, nextjs, "2. 转发请求", "HTTP :3000")
  Rel(nextjs, visitor, "3. 返回旧缓存 HTML（stale-while-revalidate）", "HTTP 200")
  Rel(nextjs, strapi, "4. 后台异步拉取最新内容", "REST API HTTP")
  Rel(strapi, postgres, "5. 查询最新文章数据", "SQL")
  Rel(postgres, strapi, "6. 返回数据", "SQL Result")
  Rel(strapi, nextjs, "7. 返回 JSON 内容", "HTTP 200 JSON")
  Rel(nextjs, nextjs, "8. 重新生成并缓存静态 HTML", "内部操作")

  UpdateRelStyle(nextjs, visitor, $textColor="#0066cc", $offsetY="-10")
  UpdateRelStyle(nextjs, strapi, $textColor="#e67e00", $offsetY="-10")
  UpdateRelStyle(nextjs, nextjs, $textColor="#999", $offsetY="-10")
```

---

## 场景三：站长通过 Strapi 发布新博客文章

```mermaid
C4Dynamic
  title Dynamic — 站长发布新博客文章

  Person(owner, "站长", "内容管理者")
  Container(nginx, "Nginx", "反向代理", "统一入口")
  Container(strapi, "Strapi CMS", "Strapi v4", "CMS Admin + API")
  ContainerDb(postgres, "PostgreSQL", "PostgreSQL 15", "内容数据库")
  ContainerDb(ossStorage, "阿里云 OSS", "OSS SDK", "媒体存储")
  Container(nextjs, "Next.js", "Next.js 14", "ISR 页面服务")

  Rel(owner, nginx, "1. 登录 /admin，填写文章内容", "HTTPS")
  Rel(nginx, strapi, "2. 转发到 Strapi Admin", "HTTP :1337")
  Rel(owner, strapi, "3. 上传封面图", "multipart/form-data")
  Rel(strapi, ossStorage, "4. 存储封面图到 OSS", "OSS SDK HTTPS")
  Rel(ossStorage, strapi, "5. 返回图片 CDN URL", "HTTPS")
  Rel(owner, strapi, "6. 点击发布", "HTTP PUT")
  Rel(strapi, postgres, "7. 写入文章数据（状态=published）", "SQL INSERT/UPDATE")
  Rel(postgres, strapi, "8. 写入成功", "SQL OK")
  Rel(strapi, owner, "9. 发布成功响应", "HTTP 200")
  Rel(nextjs, strapi, "10. 下次 ISR 触发时自动拉取新文章", "REST API（revalidate 60s）")

  UpdateRelStyle(strapi, ossStorage, $textColor="#e67e00", $offsetY="-10")
  UpdateRelStyle(strapi, postgres, $textColor="#e67e00", $offsetY="-10")
  UpdateRelStyle(nextjs, strapi, $textColor="#0066cc", $offsetY="-10")
```

---

## 流程总结

| 场景 | 关键机制 | 用户感知 |
|---|---|---|
| ISR 缓存命中 | Next.js 直接返回静态 HTML | 极速响应（< 100ms） |
| ISR 缓存过期 | stale-while-revalidate：先返回旧页面，后台异步更新 | 无感知，下次刷新看到新内容 |
| 站长发布内容 | Strapi 写库 → 60s 内 ISR 自动重新生成页面 | 发布后约 60s 内全网更新 |
