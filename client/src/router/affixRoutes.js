import TheHeader from "../components/layout/TheHeader.vue";

export default [
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
