/**
 * 邮箱 + 密码 登录
 * @param {*} body { email, password }
 * @returns {Promise} { token, user }
 */
export const loginAPI = ($api, body) => {
	return $api('/user/login', {
		method: 'POST',
		body
	})
}

/**
 * 注册账号
 * @param {*} body { username, email, password }
 * @returns {Promise} 用户信息（不含密码）
 */
export const registerAPI = ($api, body) => {
	return $api('/user/register', {
		method: 'POST',
		body
	})
}
