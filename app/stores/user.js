import { defineStore } from 'pinia'
import { navigateTo } from '#app'
import { MAX_RESUME_COUNT } from '@/constants'

export const useUserStore = defineStore('user', {
	state: () => ({
		/**
		 * userInfo 结构示例（来自 GET /user/info）：
		 * {
		 *   "_id": "6xxxxxxxxxxxxxxxxxxxxxxx",
		 *   "username": "演示账号",
		 *   "email": "demo@example.com",
		 *   "phone": "",
		 *   "avatar": "",
		 *   "roles": ["user"],
		 *   "isActive": true,
		 *   "wwCoinBalance": 0,
		 *   "resumeRemainingCount": 1,
		 *   "specialRemainingCount": 1,
		 *   "behaviorRemainingCount": 1,
		 *   "aiInterviewRemainingCount": 0,
		 *   "aiInterviewRemainingMinutes": 0,
		 *   "createdAt": "2026-01-01T00:00:00.000Z",
		 *   "updatedAt": "2026-01-01T00:00:00.000Z"
		 * }
		 */
		userInfo: {},
		isLogin: false,
		token: '',
		// 简历列表：由后端解析出纯文本后保存在本地，元素结构为
		// { resumeId, resumeName, resumeContent, charCount, createTime }
		resumes: []
	}),
	getters: {
		// 是否可以添加更多简历
		canAddResume: (state) => state.resumes.length < MAX_RESUME_COUNT
	},
	actions: {
		// 登出
		logout() {
			this.isLogin = false
			this.token = ''
			this.userInfo = {}
			this.resumes = []
			// navigateTo('/login')
		},
		// 更新用户信息
		updateUserInfo(userInfo) {
			this.userInfo = { ...this.userInfo, ...userInfo }
		},
		// 更新旺旺币余额
		updateWalletBalance(balance) {
			this.wallet.balance = balance
		},
		// 添加充值记录
		addRechargeRecord(record) {
			this.wallet.rechargeRecords.unshift(record)
		},
		// 添加消费记录
		addConsumptionRecord(record) {
			this.wallet.consumptionRecords.unshift(record)
		},
		// 添加简历
		addResume(resume) {
			if (this.resumes.length < 5) {
				this.resumes.push(resume)
			}
		},
		// 删除简历
		removeResume(index) {
			this.resumes.splice(index, 1)
		},
		// 更新简历列表（用于拖拽排序）
		updateResumes(resumes) {
			this.resumes = resumes
		}
	},
	persist: true
})
