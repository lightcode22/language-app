<template>
	<div class="w-auto grid grid-cols-7 py-3 montserrat">
		<div class="col-span-1">{{ userInfo.username }}</div>
		<div class="col-span-1">{{ userInfo.email || "-" }}</div>
		<div class="col-span-1">
			{{ formattedDate }}
		</div>
		<div
			class="col-span-1"
			:class="userInfo.role === 'user' ? 'bg-blue-500' : 'bg-yellow-500'"
		>
			{{ userInfo.role }}
		</div>
		<div class="col-span-1">-</div>
		<div class="col-span-1">
			{{ userInfo.active ? "активен" : "заблокирован" }}
		</div>
		<div class="col-span-1 text-right">
			<base-button class="inline mr-4 bg-blue-400 hover:bg-blue-500 text-white"
				>изменить</base-button
			>
			<base-button class="inline bg-red-400 hover:bg-red-500 text-white"
				>удалить</base-button
			>
		</div>
	</div>
</template>

<script>
import BaseButton from "../../components/ui/BaseButton.vue";

export default {
	props: ["user"],
	setup(props) {
		const userInfo = { ...props.user };
		const link = `/users/${userInfo.username}`;

		let rawDate = new Date(userInfo.registrationDate);
		let formattedDate =
			rawDate.getDate() +
			"." +
			(rawDate.getMonth() + 1) +
			"." +
			rawDate.getFullYear() +
			" " +
			rawDate.getHours() +
			":" +
			rawDate.getMinutes();

		return {
			BaseButton,
			userInfo,
			formattedDate,
			link,
		};
	},
};
</script>
