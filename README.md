# 个人网站

基于 Next.js 14 + Strapi v4 的综合型个人网站，包含博客、视频分享、书籍分享三大内容模块。

## 技术栈

| 层级 | 技术 |
|---|---|
| 前端 | Next.js 14 (App Router) + TypeScript + MUI v7 |
| CMS | Strapi v4 (自托管) |
| 数据库 | PostgreSQL 15 |
| 媒体存储 | 阿里云 OSS |
| 部署 | 阿里云 ECS + Nginx + PM2 |

## 项目结构

```
├── src/                    # Next.js 前端
│   ├── app/               # App Router 页面
│   ├── components/        # UI 组件
│   ├── lib/               # Strapi 客户端
│   ├── theme/             # MUI 主题
│   └── types/             # TypeScript 类型
├── backend/               # Strapi CMS
│   └── src/api/           # 内容类型 & Lifecycles
├── deploy/                # 部署配置
│   ├── nginx/             # Nginx 配置
│   ├── scripts/           # 部署脚本
│   └── ecosystem.config.js # PM2 配置
├── docs/                  # 项目文档
│   ├── prds/              # 产品需求文档
│   ├── architecture/      # C4 架构图
│   ├── database/          # 数据库 Schema
│   ├── openapi/           # API 规格
│   └── qa/                # 测试计划
└── .github/workflows/     # GitHub Actions CI/CD
```

## 快速开始

### 前置要求
- Node.js >= 20
- pnpm >= 9
- PostgreSQL 15

### 本地开发

```bash
# 1. 克隆仓库
git clone https://github.com/your-username/personal-website.git
cd personal-website

# 2. 安装前端依赖
pnpm install

# 3. 安装后端依赖
cd backend && pnpm install && cd ..

# 4. 配置环境变量
cp .env.example .env.local
cp backend/.env.example backend/.env

# 5. 启动 Strapi（新终端）
cd backend && pnpm develop

# 6. 启动 Next.js（新终端）
pnpm dev
```

访问 http://localhost:3000 查看前端，http://localhost:1337/admin 访问 Strapi 后台。

### 生产部署

```bash
# 首次部署（初始化服务器）
./deploy/scripts/deploy.sh init

# 完整部署
./deploy/scripts/deploy.sh all

# 仅更新前端
./deploy/scripts/deploy.sh frontend
```

详细部署文档见 [deploy/](./deploy/)。

## 环境变量

| 变量 | 说明 |
|---|---|
| `STRAPI_URL` | Strapi 服务地址 |
| `STRAPI_API_TOKEN` | Strapi API Token |
| `NEXT_PUBLIC_SITE_URL` | 网站公开 URL |
| `NEXTJS_REVALIDATE_TOKEN` | ISR 重验证密钥 |

详见 [.env.example](.env.example) 和 [backend/.env.example](backend/.env.example)。

## 文档

- [产品需求文档](docs/prds/personal-website-v1.0-prd.md)
- [C4 架构文档](docs/architecture/README.md)
- [数据库 Schema](docs/database/README.md)
- [API 规格（OpenAPI）](docs/openapi/api.openapi.yaml)
- [前后端协作规格](docs/api/backend-requirements.md)
- [测试计划](docs/qa/test-plan.md)

## License

MIT
