module.exports = {
    apps: [
        {
            name: "mini-mall-backend",
            cwd: "./backend",
            script: "./src/server.js",
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: "1G",
            env: {
                NODE_ENV: "production",
                PORT: 8080,
                FRONTEND_URL: "*"
            },
            env_production: {
                NODE_ENV: "production"
            }
        },
        {
            name: "mini-mall-frontend",
            cwd: "./frontend",
            script: "serve",
            env: {
                PM2_SERVE_PATH: '.',
                PM2_SERVE_PORT: 3000,
                PM2_SERVE_SPA: 'true',
                PM2_SERVE_HOMEPAGE: '/index.html'
            }
        }
    ]
};
