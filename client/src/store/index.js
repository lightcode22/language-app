import { createStore } from "vuex";

const store = createStore({
	state() {
		return { role: null };
	},
	getters: {},
	mutations: {
		logIn(state, payload) {
			state.role = payload;
		},
		logOut(state) {
			state.role = null;
		},
	},
	actions: {},
});

export default store;
