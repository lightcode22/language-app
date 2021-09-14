import { createRouter, createWebHistory } from "vue-router";
import store from "../store/index";
import { checkAccess } from "../../services/AuthService";
import TheHeader from "../components/layout/TheHeader.vue";

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
	{
		path: "/affixes",
		name: "Affixes",
		components: {
			header: TheHeader,
			main: () => import("../views/Affixes.vue"),
		},
	},
	{
		path: "/affixes/:id",
		name: "AboutAffix",
		props: true,
		components: {
			header: TheHeader,
			main: () => import("../views/AboutAffix.vue"),
		},
	},
	{
		path: "/affixes/addAffix",
		name: "AddAffix",
		components: {
			header: TheHeader,
			main: () => import("../views/AddAffix.vue"),
		},
		meta: { requiresAuth: true, roles: ["moderator", "admin"] },
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

router.beforeEach(function(to, _, next) {
	if (to.meta.requiresAuth) {
		console.log("nujna autorizacia");

		checkAccess()
			.then((res) => {
				if (res.status === 400) {
					next("/");
				} else if (res.status === 200) {
					if (to.meta.roles && !to.meta.roles.includes(res.data)) {
						next("/");
					}

					next();
				} else {
					// store.commit("logOut");
					next("/");
				}
			})
			.catch((error) => {
				// если произошла ошибка, независящая от пользователя

				console.log(error);
			});
	} else if (to.meta.requiresUnauth && !!store.state.role) {
		next("/");
	} else {
		next();
	}
});

export default router;
