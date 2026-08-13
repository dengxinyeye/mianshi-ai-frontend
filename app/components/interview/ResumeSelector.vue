<template>
	<div class="space-y-4">
		<!-- 简历选择区域 -->
		<div class="space-y-3">
			<div class="flex items-center justify-between">
				<slot name="title">
					<h3 class="text-sm font-semibold text-neutral-900">选择已有简历</h3>
				</slot>
				<UButton
					v-if="userStore.canAddResume"
					color="primary"
					variant="ghost"
					size="sm"
					icon="i-heroicons-plus"
					@click="isUploadResumeModalVisible = true"
				>
					上传新简历
				</UButton>
				<span v-else class="text-sm text-gray-500">
					最多上传 {{ MAX_RESUME_COUNT }} 份简历
				</span>
			</div>

			<!-- 简历列表 -->
			<div
				v-if="userStore.resumes.length > 0"
				class="space-y-2 max-h-[300px] overflow-y-auto pr-1"
			>
				<div
					v-for="(resume, index) in userStore.resumes"
					:key="resume.resumeId"
					:class="[
						'group flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all',
						interviewStore.resumeId === resume.resumeId
							? 'border-primary-300 bg-primary-50/50'
							: 'border-gray-200 hover:border-primary-200 hover:bg-gray-50'
					]"
					@click="selectResume(resume)"
				>
					<div
						class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0"
					>
						<UIcon
							name="i-heroicons-document-text"
							class="w-5 h-5 text-primary-600"
						/>
					</div>
					<div class="flex-1 min-w-0">
						<p class="font-medium text-neutral-900 truncate text-sm">
							{{ resume.resumeName }}
						</p>
						<p class="text-xs text-neutral-500 mt-0.5">
							{{ formatDate(resume.createTime) }}
						</p>
					</div>

					<!-- 预览按钮 -->
					<UButton
						color="neutral"
						variant="ghost"
						size="sm"
						icon="i-heroicons-eye"
						class="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
						@click.stop="handlePreview(resume)"
					/>

					<UButton
						color="neutral"
						variant="ghost"
						size="sm"
						icon="i-heroicons-trash"
						class="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
						@click.stop="handleDelete(index, resume)"
					/>

					<UIcon
						v-if="interviewStore.resumeId === resume.resumeId"
						name="i-heroicons-check-circle"
						class="w-5 h-5 text-primary-500 shrink-0"
					/>
				</div>
			</div>

			<!-- 空状态 -->
			<div
				v-else
				class="flex flex-col items-center justify-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg"
			>
				<UIcon name="i-heroicons-document-text" class="w-10 h-10 mb-2" />
				<p class="text-sm">暂无简历</p>
				<UButton
					v-if="userStore.canAddResume"
					color="primary"
					variant="ghost"
					size="sm"
					class="mt-2"
					@click="isUploadResumeModalVisible = true"
				>
					立即上传
				</UButton>
			</div>
		</div>

		<!-- 分隔线 -->
		<div class="relative">
			<div class="absolute inset-0 flex items-center">
				<div class="w-full border-t border-gray-200"></div>
			</div>
			<div class="relative flex justify-center text-xs">
				<span class="bg-white px-2 text-gray-500">或</span>
			</div>
		</div>

		<!-- 手动输入 -->
		<div class="space-y-2">
			<h3 class="text-sm font-semibold text-neutral-900">手动输入简历内容</h3>
			<UTextarea
				v-model="interviewStore.resumeText"
				placeholder="粘贴你的简历内容..."
				:rows="6"
				class="w-full"
				@update:model-value="handleTextChange"
			/>
			<p class="text-xs text-gray-500">
				支持直接粘贴简历文本内容，系统将自动解析
			</p>
		</div>

		<!-- 上传简历弹窗 -->
		<UploadResumeModal
			v-model:open="isUploadResumeModalVisible"
			@uploaded="handleResumeUploaded"
		/>

		<!-- 预览弹窗 -->
		<UModal
			v-model:open="previewModal"
			:title="previewTitle"
			:ui="{ content: 'w-[1200px] max-w-[90vw]' }"
		>
			<template #body>
				<div class="border rounded-lg overflow-hidden">
					<pre
						v-if="previewResume?.resumeContent"
						class="max-h-[600px] overflow-y-auto whitespace-pre-wrap break-words p-4 text-sm leading-relaxed text-gray-700"
						>{{ previewResume.resumeContent }}</pre
					>
					<div v-else class="p-12 text-center text-gray-500">
						<p>暂无可预览的解析内容</p>
					</div>
				</div>
			</template>
		</UModal>
	</div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import UploadResumeModal from '@/components/profile/UploadResumeModal.vue'
import dayjs from 'dayjs'
import { useInterviewStore } from '@/stores/interview'
import { useGlobalModal } from '@/composables/useGlobalModal'
import { useToast } from '#imports'
import { MAX_RESUME_COUNT } from '@/constants'

const props = defineProps({
	modelValue: {
		type: [String, Number, Object],
		default: null
	}
})

const emit = defineEmits(['update:modelValue'])

const globalModal = useGlobalModal()
const toast = useToast()
const userStore = useUserStore()
const interviewStore = useInterviewStore()

const isUploadResumeModalVisible = ref(false)

// 预览相关
const previewModal = ref(false)
const previewResume = ref(null)

// 格式化日期
const formatDate = (date) => {
	if (!date) return ''
	return dayjs(date).format('YYYY-MM-DD')
}

// 选择简历
const selectResume = (resume) => {
	interviewStore.resumeId = resume.resumeId
	// 简历文本保存在本地，选中时直接回填，后续请求以 resumeContent 提交给后端
	interviewStore.resumeText = resume.resumeContent || ''
	emit('update:modelValue', {
		type: 'resume',
		resumeId: resume.resumeId,
		resumeContent: resume.resumeContent || '',
		resume: resume
	})
}

// 手动输入变化
const handleTextChange = (value) => {
	if (value.trim()) {
		interviewStore.resumeId = null // 清空选择的简历
		emit('update:modelValue', {
			type: 'text',
			text: value.trim()
		})
	} else {
		emit('update:modelValue', null)
	}
}

const deleteIndex = ref(-1)
const deleteResume = ref(null)

// 删除简历
const handleDelete = (index, resume) => {
	deleteIndex.value = index
	deleteResume.value = resume

	globalModal.showModal({
		title: '确认删除',
		description: '确定要删除这份简历吗？删除后无法恢复。',
		buttons: [
			{
				label: '取消',
				color: 'gray',
				variant: 'ghost'
			},
			{ label: '确定删除', color: 'error', onClick: confirmDelete }
		]
	})
}

// 确认删除（简历保存在本地 store）
const confirmDelete = () => {
	userStore.removeResume(deleteIndex.value)
	toast.add({
		title: '删除成功',
		color: 'success'
	})

	// 若删除的正是当前选中的简历，同步清空选择
	if (interviewStore.resumeId === deleteResume.value?.resumeId) {
		interviewStore.resumeId = null
		interviewStore.resumeText = ''
		emit('update:modelValue', null)
	}

	deleteIndex.value = -1
	deleteResume.value = null
}

// 预览简历（展示解析后的纯文本内容）
const handlePreview = (resume) => {
	previewResume.value = resume
	previewModal.value = true
}

// 预览标题
const previewTitle = computed(
	() => previewResume.value?.resumeName || '简历预览'
)

// 简历上传成功（解析结果已写入本地 store）
const handleResumeUploaded = () => {
	isUploadResumeModalVisible.value = false
}

// 监听外部值变化
watch(
	() => props.modelValue,
	(newValue) => {
		if (!newValue) {
			return
		}

		if (newValue.type === 'text') {
			interviewStore.resumeText = newValue.text || ''
			interviewStore.resumeId = null
		} else if (newValue.type === 'resume') {
			interviewStore.resumeId = newValue.resumeId
			// 保留简历正文：请求最终以 resumeContent 提交，清空会导致简历内容丢失
			interviewStore.resumeText =
				newValue.resumeContent ||
				userStore.resumes.find((it) => it.resumeId === newValue.resumeId)
					?.resumeContent ||
				''
		}
	},
	{ immediate: true }
)
</script>

<style scoped></style>
