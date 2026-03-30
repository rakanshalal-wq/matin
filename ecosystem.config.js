module.exports = {
  apps: [{
    name: "matin",
    script: "node_modules/.bin/next",
    args: "start",
    cwd: "/var/www/matin/matin-new",
    instances: 1,
    exec_mode: "fork",
    autorestart: true,
    watch: false,
    max_memory_restart: "2G",
    env: {
      NODE_ENV: "production",
      PORT: 3000
    },
    error_file: "/root/.pm2/logs/matin-error.log",
    out_file: "/root/.pm2/logs/matin-out.log",
    time: true,
    restart_delay: 5000,
    max_restarts: 20,
    min_uptime: "30s"
  }]
};
