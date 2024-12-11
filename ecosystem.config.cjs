module.exports = {
    apps: [
        {
            name: 'api',
            script: 'pnpm',
            args: 'api serve'
        },
        {
            name: 'app',
            script: 'pnpm',
            args: 'app serve'
        },
        {
            name: 'sitemap',
            script: 'pnpm',
            args: 'api script sitemap ../app/dist',
            cron_restart: '0 2 * * *',
        },
        {
            name: 'backup',
            script: 'pnpm',
            args: 'api script backup',
            cron_restart: '0 3 * * *',
        },
        {
            name: 'messages',
            script: 'pnpm',
            args: 'api script messages',
            cron_restart: '*/15 * * * *',
        },
        {
            name: 'indexing',
            script: 'pnpm',
            args: 'api script indexing',
            cron_restart: '0 * * * *',
        }
    ]
}