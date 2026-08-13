/**
 * 上传简历文件并解析为纯文本
 *
 * 后端在内存中完成 PDF / DOCX 解析后直接返回文本，不做文件存储，
 * 因此前端拿到 resumeContent 后自行保存（当前存于本地 Pinia，已持久化）。
 *
 * @param {File} file 用户选择的简历文件
 * @returns {Promise} { resumeContent, charCount, estimatedTokens, warnings }
 */
export const parseResumeFileAPI = ($api, file) => {
	const formData = new FormData()
	formData.append('file', file)

	return $api('/interview/resume/parse', {
		method: 'POST',
		body: formData
	})
}
