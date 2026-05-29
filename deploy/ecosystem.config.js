# PM2 Ecosystem Configuration
# 使用方式：pm2 start ecosystem.config.js --env production

module.exports = {
  apps: [
    {
      name: 'nextjs',
      cwd: '/var/www/personal-site/frontend',
      script: 'node_modules/.bin/next',
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      watch: false,
      max_memory_restart: '512M',
      error_file: '/var/log/pm2/nextjs-error.log',
      out_file: '/var/log/pm2/nextjs-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      restart_delay: 3000,
      autorestart: true,
    },
    {
      name: 'strapi',
      cwd: '/var/www/personal-site/cms',
      script: 'node_modules/.bin/strapi',
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        PORT: 1337,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 1337,
      },
      watch: false,
      max_memory_restart: '1024M',
      error_file: '/var/log/pm2/strapi-error.log',
      out_file: '/var/log/pm2/strapi-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      restart_delay: 5000,
      autorestart: true,
    },
  ],
};
