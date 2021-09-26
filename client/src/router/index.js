import { createRouter, createWebHistory } from "vue-router";
import store from "../store/index";
import AdminRoutes from "./adminRoutes";
import AffixRoutes from "./affixRoutes";
import { checkAccess } from "../../services/AuthService";

const routes = [
	{
		path: "/",
		name: "Homepage",
		components: {
			header: () => import("../components/layout/HomepageHeader.vue"),
			main: () => import("../views/Home.vue"),
		},
	},
	{
		path: "/login",
		name: "LoginPage",
		components: {
			main: () => import("../views/LoginPage.vue"),
		},
		meta: { requiresUnauth: true },
	},
	{
		path: "/register",
		name: "RegisterPage",
		components: {
			main: () => import("../views/RegisterPage.vue"),
		},
		meta: { requiresUnauth: true },
	},
	...AffixRoutes,
	...AdminRoutes,
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

router.beforeEach(async (to, _, next) => {
	let role;

	try {
		const data = await checkAccess();
		role = data;
	} catch (e) {
		console.log(e);
		// store.commit("logOut");
		next("/");
	}

	if (to.meta.requiresAuth && role) {
		if (to.meta.roles && !to.meta.roles.includes(role)) {
			next("/");
		}

		next();
	}

	if (to.meta.requiresUnauth && !role) {
		if (store.state.role) {
			next("/");
		} else {
			next();
		}
	} else {
		next();
	}
});

export default router;
