import TheHeader from "../components/layout/TheHeader.vue";

export default [
	{
		path: "/admin/users",
		name: "AllUsers",
		components: {
			header: TheHeader,
			main: () => import("../components/admin/AllUsers.vue"),
		},
	},
];
