#!/bin/bash
# deploy.sh — 阿里云 ECS 一键部署脚本
# 使用方式：./deploy/scripts/deploy.sh [frontend|backend|all]
# 首次部署：./deploy/scripts/deploy.sh all
# 仅更新前端：./deploy/scripts/deploy.sh frontend

set -euo pipefail

# ── 配置项（按实际情况修改）────────────────────────────────────────────────
DEPLOY_TARGET="${1:-all}"
SERVER_USER="ubuntu"
SERVER_HOST="your-server-ip"
FRONTEND_DIR="/var/www/personal-site/frontend"
BACKEND_DIR="/var/www/personal-site/cms"
REPO_URL="https://github.com/your-username/personal-website.git"
NODE_VERSION="20"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info()    { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn()    { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# ── 服务器初始化（首次运行）────────────────────────────────────────────────
setup_server() {
  log_info "初始化服务器环境..."

  ssh "${SERVER_USER}@${SERVER_HOST}" bash << 'EOF'
    set -euo pipefail

    # 安装 Node.js 20
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs

    # 安装 pnpm
    npm install -g pnpm

    # 安装 PM2
    npm install -g pm2
    pm2 startup systemd -u $USER --hp $HOME

    # 安装 PostgreSQL
    sudo apt-get install -y postgresql postgresql-contrib
    sudo systemctl start postgresql
    sudo systemctl enable postgresql

    # 安装 Nginx
    sudo apt-get install -y nginx
    sudo systemctl enable nginx

    # 创建部署目录
    sudo mkdir -p /var/www/personal-site/{frontend,cms}
    sudo chown -R $USER:$USER /var/www/personal-site

    # 创建日志目录
    sudo mkdir -p /var/log/pm2
    sudo chown -R $USER:$USER /var/log/pm2

    echo "服务器初始化完成"
EOF
  log_info "服务器初始化完成"
}

# ── 部署前端（Next.js）────────────────────────────────────────────────────
deploy_frontend() {
  log_info "部署 Next.js 前端..."

  # Build locally
  log_info "本地构建 Next.js..."
  pnpm install --frozen-lockfile
  pnpm run build

  # Upload standalone build
  log_info "上传构建产物到服务器..."
  rsync -avz --delete \
    .next/standalone/ \
    "${SERVER_USER}@${SERVER_HOST}:${FRONTEND_DIR}/"

  rsync -avz --delete \
    .next/static/ \
    "${SERVER_USER}@${SERVER_HOST}:${FRONTEND_DIR}/.next/static/"

  rsync -avz \
    public/ \
    "${SERVER_USER}@${SERVER_HOST}:${FRONTEND_DIR}/public/"

  # Copy env file
  rsync -avz \
    .env.production \
    "${SERVER_USER}@${SERVER_HOST}:${FRONTEND_DIR}/.env"

  # Restart PM2
  ssh "${SERVER_USER}@${SERVER_HOST}" bash << EOF
    cd ${FRONTEND_DIR}
    pm2 restart nextjs --update-env || pm2 start ecosystem.config.js --only nextjs --env production
    pm2 save
    echo "Next.js 重启完成"
EOF

  log_info "前端部署完成 ✓"
}

# ── 部署后端（Strapi）────────────────────────────────────────────────────
deploy_backend() {
  log_info "部署 Strapi 后端..."

  # Upload backend source
  log_info "上传 Strapi 源码..."
  rsync -avz --delete \
    --exclude='node_modules' \
    --exclude='.env' \
    --exclude='.tmp' \
    --exclude='dist' \
    backend/ \
    "${SERVER_USER}@${SERVER_HOST}:${BACKEND_DIR}/"

  # Install & build on server
  ssh "${SERVER_USER}@${SERVER_HOST}" bash << EOF
    set -euo pipefail
    cd ${BACKEND_DIR}
    pnpm install --frozen-lockfile
    NODE_ENV=production pnpm run build

    # Restart Strapi
    pm2 restart strapi --update-env || pm2 start ecosystem.config.js --only strapi --env production
    pm2 save
    echo "Strapi 重启完成"
EOF

  log_info "后端部署完成 ✓"
}

# ── 配置 Nginx ────────────────────────────────────────────────────────────
setup_nginx() {
  log_info "配置 Nginx..."

  rsync -avz \
    deploy/nginx/personal-website.conf \
    "${SERVER_USER}@${SERVER_HOST}:/tmp/personal-website.conf"

  rsync -avz \
    deploy/ecosystem.config.js \
    "${SERVER_USER}@${SERVER_HOST}:${FRONTEND_DIR}/../ecosystem.config.js"

  ssh "${SERVER_USER}@${SERVER_HOST}" bash << 'EOF'
    sudo cp /tmp/personal-website.conf /etc/nginx/sites-available/personal-website
    sudo ln -sf /etc/nginx/sites-available/personal-website /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    sudo nginx -t && sudo systemctl reload nginx
    echo "Nginx 配置完成"
EOF

  log_info "Nginx 配置完成 ✓"
}

# ── 健康检查 ────────────────────────────────────────────────────────────
health_check() {
  log_info "执行健康检查..."
  sleep 5

  # Check Next.js
  if curl -sf "https://${SERVER_HOST}" > /dev/null 2>&1; then
    log_info "✓ 前端访问正常"
  else
    log_warn "前端可能未就绪，请手动检查"
  fi

  # Check Strapi API
  if curl -sf "https://${SERVER_HOST}/api/global" > /dev/null 2>&1; then
    log_info "✓ Strapi API 访问正常"
  else
    log_warn "Strapi API 可能未就绪，请手动检查"
  fi
}

# ── 主流程 ────────────────────────────────────────────────────────────────
main() {
  log_info "开始部署：目标 = ${DEPLOY_TARGET}"

  case "${DEPLOY_TARGET}" in
    "all")
      setup_server
      deploy_backend
      setup_nginx
      deploy_frontend
      health_check
      ;;
    "frontend")
      deploy_frontend
      health_check
      ;;
    "backend")
      deploy_backend
      ;;
    "nginx")
      setup_nginx
      ;;
    "init")
      setup_server
      setup_nginx
      ;;
    *)
      log_error "未知目标：${DEPLOY_TARGET}。使用 all|frontend|backend|nginx|init"
      ;;
  esac

  log_info "部署完成 🎉"
}

main
