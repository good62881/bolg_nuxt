// import Vue from 'vue'
// import Vuex from 'vuex'

// Vue.use(Vuex)
import {Message} from "element-ui";

// api
import * as Api from '@/api/admin'

// const store = () => new Vuex.Store({
// 	state: {
// 		userInfo: {},
// 	},
// 	mutations: {
// 		setUserInfo(state, data) {
// 			state.userInfo = data;
// 		},
// 		delUserInfo(state) {
// 			state.userInfo = {};
// 		},
// 	},
// 	actions: {
// 		async getUserInfo({commit}) {
// 			const { data } = await Api.getInfo()
// 			if (!data.code) {
// 				commit('setUserInfo',data.data)
// 			} else {
// 				Message.error(data.msg);
// 			}
// 		}
// 	}
// })

// export default store


export const state = () => ({
	userInfo: {},
})

export const mutations = {
	setUserInfo(state, data) {
		state.userInfo = data;
	},
	delUserInfo(state) {
		state.userInfo = {};
	},
}

export const actions = {
	async getUserInfo({commit}) {
		const { data } = await Api.getInfo()
		if (!data.code) {
			commit('setUserInfo',data.data)
		} else {
			Message.error(data.msg);
		}
	}
}