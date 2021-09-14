<template>
	<base-card v-if="isLoggedIn">
		<div
			class="inline-block h-14 w-14 sm:h-8 sm:w-8 rounded-full bg-red-400 "
		></div>
		<div class="inline-block ml-6 flex-1 text-lg sm:ml-3 sm:h-8 sm:text-base ">
			<span class="block sm:hidden">Hello,</span>
			<span class="block font-semibold sm:mt-0.5">username_placeholder</span>
		</div>
	</base-card>

	<base-card v-else>
		<div class="">
			<router-link to="/login"
				><base-button
					class="bg-blue-500 hover:bg-blue-400 text-white font-medium"
					>Войти</base-button
				></router-link
			>
			<!-- /
			<router-link to="/register" class="font-medium ml-1"
        >Зарегистрироваться</router-link
      > -->
		</div>
	</base-card>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import BaseCard from "../ui/BaseCard.vue";
import BaseButton from "../../components/ui/BaseButton";

export default {
	components: { BaseCard },
	setup() {
		const store = useStore();

		const isLoggedIn = computed(() => {
			return store.state.role;
		});

		return { BaseCard, isLoggedIn, BaseButton };
	},
};
</script>
