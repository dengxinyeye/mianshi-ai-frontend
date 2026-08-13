<template>
	<UApp :toaster="toaster">
		<div class="min-h-screen flex flex-col">
			<AppHeader />
			<main class="flex-1 bg-gray-50">
				<slot />
			</main>
			<footer class="border-t border-gray-200 bg-white">
				<div class="container px-4 py-12">
					<div
						class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8"
					>
						<!-- 关于我们 -->
						<div>
							<h3 class="text-sm font-semibold text-neutral-900 mb-4">
								关于我们
							</h3>
							<div class="flex items-center gap-2 mb-3">
								<ww-svg-icon name="hero" class="h-6 w-6"></ww-svg-icon>
								<span class="text-base font-semibold text-neutral-900"
									>面试汪</span
								>
							</div>
							<p class="text-sm text-neutral-600 leading-relaxed">
								极简三步，完成 AI 面试。专业的 AI
								面试平台，帮助您更好地准备面试。
							</p>
						</div>

						<!-- 快速链接 -->
						<div>
							<h3 class="text-sm font-semibold text-neutral-900 mb-4">
								快速链接
							</h3>
							<ul class="space-y-2 text-sm">
								<li>
									<NuxtLink
										to="/interview/start"
										class="text-neutral-600 hover:text-neutral-900 transition-colors"
									>
										开始 AI 面试
									</NuxtLink>
								</li>
								<li>
									<NuxtLink
										to="/faq"
										class="text-neutral-600 hover:text-neutral-900 transition-colors"
									>
										常见问题
									</NuxtLink>
								</li>
								<li>
									<NuxtLink
										to="/contact"
										class="text-neutral-600 hover:text-neutral-900 transition-colors"
									>
										联系我们
									</NuxtLink>
								</li>
							</ul>
						</div>

						<!-- 联系方式 -->
						<div>
							<h3 class="text-sm font-semibold text-neutral-900 mb-4">
								联系我们
							</h3>
							<ul class="space-y-3 text-sm">
								<li class="flex items-center gap-2 text-neutral-600">
									<UIcon
										name="i-heroicons-envelope"
										class="w-4 h-4 text-blue-600 shrink-0"
									/>
									<a
										href="mailto:support@example.com"
										class="font-mono hover:text-neutral-900 transition-colors"
									>
										support@example.com
									</a>
								</li>
							</ul>
						</div>
					</div>

					<!-- 分割线 -->
					<div class="border-t border-gray-200 pt-8">
						<div
							class="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-500"
						>
							<div class="flex flex-col md:flex-row items-center gap-4">
								<p>© {{ new Date().getFullYear() }} AI 智能面试平台</p>
							</div>
							<div class="flex items-center gap-4">
								<NuxtLink
									to="/agreement"
									class="hover:text-neutral-700 transition-colors"
								>
									用户协议
								</NuxtLink>
								<span>|</span>
								<NuxtLink
									to="/policy"
									class="hover:text-neutral-700 transition-colors"
								>
									隐私政策
								</NuxtLink>
							</div>
						</div>
					</div>
				</div>
			</footer>
			<BackToTop />
		</div>
	</UApp>
</template>

<script setup>
import { useUIStore } from '@/stores/ui'
import { navigateTo } from '#imports'

const toaster = { position: 'top-right' }
const uiStore = useUIStore()
</script>

<style scoped></style>
