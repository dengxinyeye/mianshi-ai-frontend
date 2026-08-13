// 兑换一次服务（服务包含简历押题 / 专项面试 / 综合面试）的成本
export const REDEEM_COST = 20

// 服务标记
export const SERVICE_TAGS = {
	RESUME: 'resume',
	SPECIAL: 'special',
	BEHAVIOR: 'behavior'
}

// 服务亮点列表 - 三大核心服务类型
export const serviceHighlights = [
	{
		id: SERVICE_TAGS.RESUME,
		title: '面试押题',
		badge: '精准预测',
		description:
			'基于岗位 JD 和简历，AI 智能预测高频面试题，让你提前做好准备。',
		points: [
			'结合岗位 JD 智能生成押题清单',
			'附带高分参考答案与回答技巧',
			'覆盖技术、项目、行为等多维度'
		],
		icon: 'i-heroicons-document-text',
		highlight: '3-5 分钟快速生成，命中率 80%+'
	},
	{
		id: SERVICE_TAGS.SPECIAL,
		title: '专项面试',
		badge: '实战模拟',
		description: '针对技术面、业务面进行深度模拟，AI 面试官实时追问与反馈。',
		points: [
			'真实面试场景 1v1 模拟对话',
			'AI 即时追问与深度挖掘',
			'多轮问答评估技术深度'
		],
		icon: 'i-heroicons-bolt',
		highlight: '约 1 小时，支持语音/文字多模态'
	},
	{
		id: SERVICE_TAGS.BEHAVIOR,
		title: '行测 + HR 面试',
		badge: '综合评估',
		description: '覆盖行政能力测试 + HR 软技能面试，全方位提升面试综合素质。',
		points: [
			'行测题库与限时模拟测试',
			'HR 面试软技能评估',
			'沟通表达与情商评估反馈'
		],
		icon: 'i-heroicons-chat-bubble-left-right',
		highlight: '约 45 分钟，双重评估维度'
	}
]
