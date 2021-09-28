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
			<FilterTags @filtersChange="showmeFilters" />
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
import FilterTags from "./FilterTags.vue";

export default {
	setup() {
		const users = ref([]);

		const allUsers = computed(() => {
			return users.value.users;
		});

		const usersCount = computed(() => {
			return users.value.result;
		});

		const showmeFilters = (value) => {
			console.log("- - - - - - -");
			console.log(value);
			console.log("- - - - - - -");
		};

		onMounted(() => {
			getAllUsers();
		});

		async function getAllUsers() {
			try {
				users.value = await getAll();
			} catch (err) {
				console.log("ошибочка произошла");
			}
		}

		return {
			users: allUsers,
			count: usersCount,
			BaseButton,
			UsersListItem,
			FilterTags,
			showmeFilters,
		};
	},
};
</script>
