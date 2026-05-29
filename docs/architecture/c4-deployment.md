# C4 Deployment — 生产环境部署架构

> 展示个人网站在阿里云生产环境中的物理部署结构。面向 DevOps 和运维人员。

```mermaid
C4Deployment
  title Deployment Diagram — 个人网站（阿里云生产环境）

  Deployment_Node(userBrowser, "访客浏览器", "Chrome / Safari / Firefox") {
    Container(browserApp, "Web 页面", "HTML / CSS / JS", "渲染 Next.js 输出的页面内容")
  }

  Deployment_Node(ownerBrowser, "站长浏览器", "Chrome / Safari") {
    Container(adminApp, "Strapi Admin UI", "React SPA", "内容管理后台界面")
  }

  Deployment_Node(aliyun, "阿里云", "公有云") {

    Deployment_Node(ecs, "ECS 云服务器", "Ubuntu 22.04 LTS / 2核4G") {

      Deployment_Node(nginxNode, "Nginx 进程", "Nginx 1.24") {
        Container(nginxContainer, "Nginx", "反向代理", "SSL 终止，路由 :443 → Next.js :3000 / Strapi :1337")
      }

      Deployment_Node(pm2Node, "PM2 进程管理器", "PM2 Latest") {
        Container(nextjsApp, "Next.js 应用", "Next.js 14 / Node.js 20", "SSG+ISR 页面服务，监听 :3000")
        Container(strapiApp, "Strapi 应用", "Strapi v4 / Node.js 20", "CMS API + Admin，监听 :1337")
      }

      Deployment_Node(dbNode, "数据库", "PostgreSQL 15") {
        ContainerDb(postgresDb, "PostgreSQL", "PostgreSQL 15", "内容数据持久化，仅本机访问 :5432")
      }

    }

    Deployment_Node(ossNode, "阿里云 OSS", "对象存储 + CDN") {
      ContainerDb(ossStorage, "媒体存储桶", "OSS Bucket", "存储封面图、头像等媒体文件，通过 CDN 加速分发")
    }

  }

  Deployment_Node(extVideo, "外部视频平台", "B站 / YouTube") {
    Container(videoEmbed, "视频嵌入服务", "iframe embed API", "提供视频播放器 iframe")
  }

  Rel(userBrowser, nginxContainer, "HTTPS 请求页面", ":443")
  Rel(ownerBrowser, nginxContainer, "HTTPS 访问后台", ":443 /admin")
  Rel(nginxContainer, nextjsApp, "转发页面请求", "HTTP :3000")
  Rel(nginxContainer, strapiApp, "转发 API/Admin 请求", "HTTP :1337")
  Rel(nextjsApp, strapiApp, "ISR 数据请求", "HTTP REST API")
  Rel(strapiApp, postgresDb, "读写内容数据", "SQL TCP :5432")
  Rel(strapiApp, ossStorage, "上传媒体文件", "OSS SDK HTTPS")
  Rel(browserApp, ossStorage, "加载媒体文件", "CDN HTTPS")
  Rel(browserApp, videoEmbed, "嵌入视频播放", "iframe HTTPS")

  UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

## 部署配置说明

### 阿里云 ECS 规格建议

| 配置项 | 建议值 | 说明 |
|---|---|---|
| 实例规格 | 2核 4G | 可支撑 Next.js + Strapi + PostgreSQL 同机部署 |
| 操作系统 | Ubuntu 22.04 LTS | 长期支持，稳定性好 |
| 系统盘 | 40GB SSD | 应用代码 + 数据库本地缓存 |
| 带宽 | 5Mbps 按量 | 静态资源走 OSS CDN，带宽压力小 |
| 安全组 | 仅开放 80、443 | 其余端口仅内网访问 |

### Nginx 路由规则

```nginx
# 前端页面（默认）
location / {
    proxy_pass http://127.0.0.1:3000;
}

# Strapi API
location /api/ {
    proxy_pass http://127.0.0.1:1337;
}

# Strapi Admin 后台
location /admin/ {
    proxy_pass http://127.0.0.1:1337;
}

# Strapi 上传文件路径
location /uploads/ {
    proxy_pass http://127.0.0.1:1337;
}
```

### PM2 进程配置

```json
{
  "apps": [
    {
      "name": "nextjs",
      "script": "node_modules/.bin/next",
      "args": "start",
      "cwd": "/var/www/personal-site/frontend",
      "env": { "PORT": "3000", "NODE_ENV": "production" }
    },
    {
      "name": "strapi",
      "script": "node_modules/.bin/strapi",
      "args": "start",
      "cwd": "/var/www/personal-site/cms",
      "env": { "PORT": "1337", "NODE_ENV": "production" }
    }
  ]
}
```

### SSL 证书

使用阿里云免费 SSL 证书（DV 型）或 Let's Encrypt，由 Nginx 统一处理 SSL 终止。
