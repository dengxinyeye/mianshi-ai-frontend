<template>
	<div
		class="card relative overflow-hidden border border-gray-200 bg-white p-8 shadow-lg"
	>
		<div
			class="absolute -top-24 right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"
		></div>

		<!-- 标题区 -->
		<div class="flex items-center justify-between gap-4">
			<div>
				<h2 class="text-xl font-semibold text-neutral-900">
					{{ isRegister ? '注册账号' : '登录面试汪' }}
				</h2>
				<p class="text-sm text-neutral-500">
					{{
						isRegister
							? '填写邮箱与密码即可创建账号'
							: '使用邮箱与密码，快速进入面试汪'
					}}
				</p>
			</div>
			<div class="rounded-full bg-primary/10 p-2 text-primary leading-0">
				<UIcon name="i-heroicons-user-circle" class="h-6 w-6" />
			</div>
		</div>

		<!-- 演示账号快捷入口 -->
		<button
			type="button"
			class="mt-6 flex w-full items-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 px-4 py-3 text-left text-xs text-neutral-600 transition hover:bg-primary/10"
			@click="fillDemoAccount"
		>
			<UIcon name="i-heroicons-sparkles" class="h-4 w-4 shrink-0 text-primary" />
			<span>
				<span class="font-medium text-neutral-800">使用演示账号</span>
				<span class="ml-1 text-neutral-500">
					{{ DEMO_ACCOUNT.email }} / {{ DEMO_ACCOUNT.password }}
				</span>
			</span>
		</button>

		<!-- 表单区 -->
		<form class="mt-6 space-y-4" @submit.prevent="handleSubmit">
			<div v-if="isRegister">
				<label class="mb-1.5 block text-sm text-neutral-700" for="username">
					用户名
				</label>
				<UInput
					id="username"
					v-model="form.username"
					size="lg"
					class="w-full"
					placeholder="至少 3 个字符"
					autocomplete="username"
				/>
			</div>

			<div>
				<label class="mb-1.5 block text-sm text-neutral-700" for="email">
					邮箱
				</label>
				<UInput
					id="email"
					v-model="form.email"
					type="email"
					size="lg"
					class="w-full"
					placeholder="you@example.com"
					autocomplete="email"
				/>
			</div>

			<div>
				<label class="mb-1.5 block text-sm text-neutral-700" for="password">
					密码
				</label>
				<UInput
					id="password"
					v-model="form.password"
					type="password"
					size="lg"
					class="w-full"
					placeholder="至少 6 位"
					:autocomplete="isRegister ? 'new-password' : 'current-password'"
				/>
			</div>

			<!-- 错误提示 -->
			<p
				v-if="errorMessage"
				class="flex items-center gap-1.5 text-xs text-red-500"
			>
				<UIcon name="i-heroicons-exclamation-circle" class="h-4 w-4 shrink-0" />
				{{ errorMessage }}
			</p>

			<UButton
				type="submit"
				color="primary"
				size="lg"
				block
				:loading="loading"
				:disabled="!agree"
				class="text-white"
			>
				{{ isRegister ? '注册并登录' : '登录' }}
			</UButton>
		</form>

		<!-- 模式切换 -->
		<p class="mt-5 text-center text-sm text-neutral-500">
			{{ isRegister ? '已有账号？' : '还没有账号？' }}
			<button
				type="button"
				class="text-primary hover:underline"
				@click="toggleMode"
			>
				{{ isRegister ? '去登录' : '注册一个' }}
			</button>
		</p>

		<!-- 协议 -->
		<div class="mt-8 flex items-start gap-2 text-xs text-neutral-500">
			<UCheckbox
				v-model="agree"
				name="agreement"
				color="success"
				aria-label="同意协议"
			/>
			<p class="leading-[20px]">
				继续登录即表示你已阅读并同意
				<NuxtLink
					to="/agreement"
					target="_blank"
					rel="noopener noreferrer"
					class="text-primary hover:underline"
				>
					《服务协议》
				</NuxtLink>
				和
				<NuxtLink
					to="/policy"
					target="_blank"
					rel="noopener noreferrer"
					class="text-primary hover:underline"
				>
					《隐私政策》
				</NuxtLink>
			</p>
		</div>
	</div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useNuxtApp, useToast } from '#imports'
import { loginAPI, registerAPI } from '@/api/login'
import { useUserStore } from '@/stores/user'
import { handleLoginSuccess } from '@/permission'

// 本地演示账号，由后端 `npm run seed` 预置
const DEMO_ACCOUNT = {
	email: 'demo@mianshiwang.com',
	password: 'demo1234'
}

const { $api } = useNuxtApp()
const toast = useToast()
const userStore = useUserStore()

// login | register
const mode = ref('login')
const isRegister = computed(() => mode.value === 'register')

const form = reactive({
	username: '',
	email: '',
	password: ''
})

const agree = ref(true)
const loading = ref(false)
const errorMessage = ref('')

const toggleMode = () => {
	mode.value = isRegister.value ? 'login' : 'register'
	errorMessage.value = ''
}

const fillDemoAccount = () => {
	mode.value = 'login'
	form.email = DEMO_ACCOUNT.email
	form.password = DEMO_ACCOUNT.password
	errorMessage.value = ''
}

/**
 * 前端基础校验，规则与后端 DTO 保持一致，避免无效请求
 */
const validate = () => {
	if (isRegister.value && form.username.trim().length < 3) {
		errorMessage.value = '用户名至少 3 个字符'
		return false
	}

	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
		errorMessage.value = '请输入正确的邮箱格式'
		return false
	}

	if (form.password.length < 6) {
		errorMessage.value = '密码至少 6 位'
		return false
	}

	errorMessage.value = ''
	return true
}

const handleSubmit = async () => {
	if (loading.value || !validate()) {
		return
	}

	loading.value = true

	try {
		const email = form.email.trim()

		// 注册模式：先创建账号，再走同一套登录流程拿 token
		if (isRegister.value) {
			await registerAPI($api, {
				username: form.username.trim(),
				email,
				password: form.password
			})

			toast.add({ title: '注册成功，正在登录…', color: 'success' })
		}

		const { token, user } = await loginAPI($api, {
			email,
			password: form.password
		})

		userStore.isLogin = true
		userStore.userInfo = user
		userStore.token = token

		// 统一跳回登录前的页面（内部已做开放重定向校验）
		handleLoginSuccess()
	} catch (error) {
		// 网络层与业务层的 toast 已由 $api 统一处理，这里只补充表单内的错误态
		errorMessage.value =
			error?.statusMessage || error?.message || '操作失败，请稍后重试'
	} finally {
		loading.value = false
	}
}
</script>

<style scoped></style>
