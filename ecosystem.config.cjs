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
            script: "npm",
            args: "start",
            env: {
                NODE_ENV: "production"
            }
        }
    ]
};
