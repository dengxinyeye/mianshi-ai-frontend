/**
 * 更新用户信息
 * @returns {Promise}
 */
export const updateUserInfoAPI = ($api, body) => {
	return $api('/user/profile', {
		method: 'PUT',
		body
	})
}

/**
 * 获取用户信息
 */
export const getUserInfoAPI = ($api) => {
	return $api('/user/info', {
		method: 'GET'
	})
}

/**
 * 获取消费记录
 */
export const getConsumptionRecordsAPI = ($api) => {
	return $api('/user/consumption-records', {
		method: 'GET'
	})
}
