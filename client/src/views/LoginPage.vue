<template>
	<!-- исправить ширину для мобильных -->
	<div class="mx-auto" style="width: 26rem">
		<div class="w-auto h-screen flex items-center mx-3 w-96 montserrat">
			<base-auth-form
				header-text="Войти в аккаунт"
				footer-text="Еще нет аккаунта?"
				link-text="Можно создать!"
				button-text="Войти"
				formAction="login"
				@submitted="submitForm"
			>
				<template v-slot:default>
					<div class="h-24">
						<label
							class="block text-gray-800 font-medium text-sm mb-1"
							for="username"
							>имя пользователя</label
						>
						<input
							class="
								w-full
								shadow
								appearance-none
								text-sm
								font-medium
								border
								rounded
								py-2
								px-2
								text-gray-800
								leading-tight
								focus:outline-none
							"
							name="username"
							type="text"
							placeholder=""
							v-model="username"
						/>
						<span v-if="isUsernameError.isError" class="text-red-500 text-xs">{{
							isUsernameError.message
						}}</span>
					</div>

					<div class="h-24 mb-3">
						<label
							class="block text-gray-800 font-medium text-sm mb-1"
							for="password"
							>пароль</label
						>
						<input
							class="
								w-full
								shadow
								appearance-none
								text-sm
								font-medium
								border
								rounded
								py-2
								px-2
								text-gray-800
								leading-tight
								focus:outline-none
							"
							name="password"
							type="password"
							placeholder=""
							v-model="password"
						/>
						<span v-if="isPasswordError.isError" class="text-red-500 text-xs">{{
							isPasswordError.message
						}}</span>
						<span v-else-if="isWrongCredentials" class="text-red-500 text-xs"
							>Неверное имя пользователя или пароль</span
						>
						<span
							v-else-if="submitFailed"
							class="text-red-500 text-xs font-medium"
							>Ой-ой! Что-то пошло не так...</span
						>
					</div>
				</template>
			</base-auth-form>
		</div>
	</div>
</template>

<script>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import BaseAuthForm from "../components/ui/BaseAuthForm";
import { login } from "../../services/AuthService";
import { useStore } from "vuex";

export default {
	components: { BaseAuthForm },
	setup() {
		const store = useStore();
		const router = useRouter();

		const username = ref("");
		const password = ref("");

		const submitErrors = ref([]);
		const submitFailed = ref(false);

		const isUsernameError = computed(() => {
			if (submitErrors.value.includes("username_empty")) {
				return {
					isError: 1,
					message: "Поле не должно быть пустым",
				};
			} else {
				return {
					isError: 0,
					message: "",
				};
			}
		});

		const isPasswordError = computed(() => {
			if (submitErrors.value.includes("password_empty")) {
				return {
					isError: 1,
					message: "Поле не должно быть пустым",
				};
			} else {
				return {
					isError: 0,
					message: "",
				};
			}
		});

		const isWrongCredentials = computed(() => {
			if (submitErrors.value.includes("wrong_credentials")) {
				return true;
			} else {
				return false;
			}
		});

		function submitForm() {
			submitFailed.value = false;
			submitErrors.value = [];

			if (username.value === "") {
				submitErrors.value.push("username_empty");
			}
			if (password.value === "") {
				submitErrors.value.push("password_empty");
			}

			if (!submitErrors.value.length) {
				const userCredentials = {
					username: username.value,
					password: password.value,
				};

				login(userCredentials)
					.then((res) => {
						if (res.status === 401) {
							submitErrors.value = res.data;
						} else {
							store.commit("logIn", res.data.role);
							router.replace("/");
						}
					})
					.catch((error) => {
						console.log(error);
						submitFailed.value = true;
					});
			}
		}

		return {
			BaseAuthForm,
			username,
			password,
			isUsernameError,
			isPasswordError,
			isWrongCredentials,
			submitFailed,
			submitForm,
		};
	},
};
</script>
