// 启动指令：pm2 start ecosystem.config.js
const path = require('path')

module.exports = {
	apps: [
		{
			name: 'ai-interview-nuxt',
			port: '3001',
			exec_mode: 'fork',
			script: path.join(__dirname, './.output/server', 'index.mjs'),
			env_production: {
				// 部署到自有域名后填写，用于 sitemap 等绝对地址生成
				NUXT_PUBLIC_SITE_URL: ''
			}
		}
	]
}
