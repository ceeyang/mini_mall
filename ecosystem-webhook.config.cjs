module.exports = {
    apps: [
        {
            name: "github-webhook",
            script: "./github-webhook-server.js",
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: "500M",
            env: {
                NODE_ENV: "production",
                WEBHOOK_PORT: 3001,
                WEBHOOK_SECRET: "your-secret-key-change-this",
                REPO_PATH: process.cwd(),
                WEBHOOK_BRANCH: "main"
            },
            error_file: "./logs/webhook-error.log",
            out_file: "./logs/webhook-out.log",
            log_date_format: "YYYY-MM-DD HH:mm:ss Z",
            merge_logs: true
        }
    ]
};
