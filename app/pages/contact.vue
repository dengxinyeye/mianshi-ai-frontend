<template>
	<section class="container py-12">
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-neutral-900">联系我们</h1>
			<p class="mt-2 text-sm text-neutral-500">
				有任何问题或建议，欢迎通过以下方式联系我们
			</p>
		</div>

		<div class="grid md:grid-cols-2 gap-6 mt-8">
			<!-- 邮箱联系 -->
			<div
				class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
			>
				<div class="flex flex-col items-center text-center h-full">
					<div
						class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4"
					>
						<UIcon name="i-heroicons-envelope" class="w-8 h-8 text-blue-600" />
					</div>
					<h2 class="text-xl font-semibold text-neutral-900 mb-2">邮箱联系</h2>
					<p class="text-sm text-neutral-500 mb-4">发送邮件详细说明您的问题</p>
					<div class="mt-auto w-full">
						<a
							:href="`mailto:${email}`"
							class="block bg-gray-50 rounded-lg border border-gray-200 p-4 mb-2 hover:bg-gray-100 transition-colors"
						>
							<span class="font-mono text-sm text-neutral-900 break-all">
								{{ email }}
							</span>
						</a>
						<p class="text-xs text-neutral-400">点击发送邮件</p>
					</div>
				</div>
			</div>

			<!-- 站内反馈 -->
			<div
				class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
			>
				<div class="flex flex-col items-center text-center h-full">
					<div
						class="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4"
					>
						<UIcon
							name="i-heroicons-chat-bubble-left-right"
							class="w-8 h-8 text-primary-600"
						/>
					</div>
					<h2 class="text-xl font-semibold text-neutral-900 mb-2">站内反馈</h2>
					<p class="text-sm text-neutral-500 mb-4">
						使用页面右下角的反馈入口提交问题
					</p>
					<div class="mt-auto w-full">
						<div class="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-2">
							<span class="text-sm text-neutral-700">
								支持描述问题与上传截图
							</span>
						</div>
						<p class="text-xs text-neutral-400">推荐用于产品功能反馈</p>
					</div>
				</div>
			</div>
		</div>

		<div class="mt-10 bg-white rounded-lg border border-gray-200 p-6">
			<h2 class="text-lg font-semibold text-neutral-900 mb-4">温馨提示</h2>
			<ul class="space-y-2 text-sm text-neutral-600">
				<li class="flex items-start">
					<UIcon
						name="i-heroicons-check-circle"
						class="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5"
					/>
					<span>我们会尽快回复您的咨询，通常在工作日 24 小时内回复</span>
				</li>
				<li class="flex items-start">
					<UIcon
						name="i-heroicons-check-circle"
						class="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5"
					/>
					<span>产品使用问题建议优先通过站内反馈提交，便于我们定位</span>
				</li>
				<li class="flex items-start">
					<UIcon
						name="i-heroicons-check-circle"
						class="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5"
					/>
					<span>商务合作或其他重要事宜，请通过邮箱详细说明</span>
				</li>
			</ul>
		</div>
	</section>
</template>

<script setup>
import { SEO } from '@/constants/seo'
import { useHead } from 'nuxt/app'

const email = SEO.contactEmail

useHead({
	title: `联系我们 - ${SEO.siteName}`,
	meta: [
		{
			name: 'description',
			content:
				'联系我们 - 通过邮箱或站内反馈与我们取得联系，我们会在 24 小时内回复您的问题'
		},
		{ name: 'robots', content: 'index,follow' }
	]
})
</script>
