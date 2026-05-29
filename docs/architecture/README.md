# 个人网站 — 架构文档索引

基于 C4 模型，按四个抽象层级描述个人网站系统架构。

## 文档目录

| 层级 | 文件 | 受众 | 内容 |
|---|---|---|---|
| Level 1 — Context | [c4-context.md](./c4-context.md) | 所有人 | 系统与外部参与者/系统的关系 |
| Level 2 — Container | [c4-containers.md](./c4-containers.md) | 技术团队 | 可部署容器及其交互（Nginx、Next.js、Strapi、PostgreSQL） |
| Level 3 — Component | [c4-components-nextjs.md](./c4-components-nextjs.md) | 开发者 | Next.js 前端内部组件拆分 |
| Level 4 — Deployment | [c4-deployment.md](./c4-deployment.md) | DevOps | 阿里云 ECS 生产部署结构 |
| Dynamic Flows | [c4-dynamic-flows.md](./c4-dynamic-flows.md) | 技术团队 | ISR 缓存命中/过期流程 + 内容发布流程 |

## 技术栈速览

```
前端       Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion
CMS        Strapi v4 (自托管)
数据库     PostgreSQL 15
媒体存储   阿里云 OSS + CDN
部署       阿里云 ECS + Nginx + PM2
```

## 关键架构决策

**ISR（增量静态再生成）**：所有页面采用 revalidate 60s 的 ISR 策略，兼顾静态页面性能（LCP < 2.5s）与内容时效性（发布后 60s 内全网更新）。

**Nginx 统一入口**：Next.js（:3000）和 Strapi（:1337）均不对外暴露，所有流量经 Nginx（:443）路由，统一处理 SSL 终止和安全防护。

**媒体文件外置**：封面图、头像等媒体文件存储于阿里云 OSS，通过 CDN 加速分发，减轻 ECS 带宽压力。

**视频不自托管**：视频内容以 iframe 形式嵌入 B站/YouTube，规避存储和带宽成本。

---

*文档生成时间：2026-05-29 | 对应 PRD 版本：1.0*
