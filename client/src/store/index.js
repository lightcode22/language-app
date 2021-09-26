import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

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
	plugins: [createPersistedState()],
});

export default store;
