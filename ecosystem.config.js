module.exports = {
  apps: [{
    name: "matin",
    script: "node_modules/.bin/next",
    args: "start",
    cwd: "/var/www/matin/matin-new",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "2G",
    env: { NODE_ENV: "production", PORT: 3000 },
    error_file: "/var/log/matin-error.log",
    out_file: "/var/log/matin-out.log",
    time: true,
    restart_delay: 5000,
    max_restarts: 15,
  }],
};
