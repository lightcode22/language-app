<template>
	<div class="w-auto montserrat">
		<div class="flex justify-between mb-12 mt-3">
			<span>Зарегистрированных пользователей: {{ count }}</span>
			<div>
				<input
					class="border-2 border-black"
					value="здесь будет поисковая строка"
				/>
			</div>
			<div class="">
				<router-link to=""
					><base-button
						class="font-medium text-white inline-block"
						:class="[
							isUserFilterActive.value
								? 'bg-blue-500 hover:bg-blue-600'
								: 'bg-gray-300',
						]"
						@click="switchUserFilter"
						>пользователи</base-button
					></router-link
				>
				<router-link to=""
					><base-button
						class="font-medium bg text-white inline-block mx-4"
						:class="[
							isModeratorFilterActive.value
								? 'bg-red-500 hover:bg-red-600'
								: 'bg-gray-300',
						]"
						@click="switchModeratorFilter"
						>модераторы</base-button
					></router-link
				>
				<router-link to=""
					><base-button
						class="font-medium text-white inline-block"
						:class="[
							isAdminFilterActive.value
								? 'bg-yellow-500 hover:bg-yellow-600'
								: 'bg-gray-300',
						]"
						@click="switchAdminFilter"
						>администраторы</base-button
					></router-link
				>
			</div>
		</div>

		<div class="w-auto grid grid-cols-7 font-bold montserrat">
			<div class="col-span-1">Имя пользователя</div>
			<div class="col-span-1">E-mail</div>
			<div class="col-span-1">Дата регистрации</div>
			<div class="col-span-1">Роль</div>
			<div class="col-span-1">Последняя активность</div>
			<div class="col-span-1">Статус</div>
			<div class="col-span-1"></div>
		</div>

		<div class="user-list-block">
			<UsersListItem
				class="border-b-2 last:border-b-0"
				v-for="user in users"
				:user="user"
				:key="user.username"
			/>
		</div>
	</div>
</template>

<script>
import { computed, ref, onMounted } from "vue";
import { getAll } from "../../../services/AdminService";
import BaseButton from "../../components/ui/BaseButton.vue";
import UsersListItem from "./UsersListItem.vue";

export default {
	setup() {
		const users = ref([]);

		let userFilter = ref(true);
		let moderatorFilter = ref(true);
		let adminFilter = ref(true);

		const switchUserFilter = () => {
			userFilter.value = !userFilter.value;
		};

		const switchModeratorFilter = () => {
			moderatorFilter.value = !moderatorFilter.value;
		};

		const switchAdminFilter = () => {
			adminFilter.value = !adminFilter.value;
		};

		const isUserFilterActive = computed(() => {
			return userFilter;
		});

		const isModeratorFilterActive = computed(() => {
			return moderatorFilter;
		});

		const isAdminFilterActive = computed(() => {
			return adminFilter;
		});

		const allUsers = computed(() => {
			return users.value.users;
		});

		const usersCount = computed(() => {
			return users.value.result;
		});

		onMounted(() => {
			getAllUsers();
		});

		async function getAllUsers() {
			try {
				users.value = await getAll();
			} catch (err) {
				console.log("ошибка произошла");
			}
		}

		return {
			users: allUsers,
			count: usersCount,
			BaseButton,
			UsersListItem,
			isUserFilterActive,
			isModeratorFilterActive,
			isAdminFilterActive,
			switchUserFilter,
			switchModeratorFilter,
			switchAdminFilter,
		};
	},
};
</script>
