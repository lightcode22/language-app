<template>
	<!-- исправить ширину для мобильных -->
	<div class="mx-auto" style="width:26rem;">
		<div class="w-auto h-screen flex items-center mx-4 w-96 montserrat">
			<base-auth-form
				header-text="Создать аккаунт"
				footer-text="Уже есть аккаунт?"
				link-text="Войти!"
				button-text="Создать"
				formAction="register"
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
							class="w-full shadow appearance-none text-sm font-medium border rounded py-2 px-2 mb-1 text-gray-800 leading-tight focus:outline-none"
							name="username"
							type="text"
							placeholder=""
							v-model="username"
						/>
						<span v-if="isUsernameError.isError" class="text-red-500 text-xs">{{
							isUsernameError.message
						}}</span>
					</div>

					<div class="h-24">
						<label
							class="block text-gray-800 font-medium text-sm mb-1"
							for="email"
							>e-mail (необязательно)</label
						>
						<input
							class="w-full shadow appearance-none text-sm font-medium border rounded py-2 px-2 mb-1 text-gray-800 leading-tight focus:outline-none"
							name="email"
							type="email"
							placeholder=""
							v-model="email"
						/>
						<span v-if="isEmailError.isError" class="text-red-500 text-xs">{{
							isEmailError.message
						}}</span>
					</div>

					<div class="h-24 mb-3">
						<label
							class="block text-gray-800 font-medium text-sm mb-1"
							for="password"
							>пароль</label
						>
						<input
							class="w-full shadow appearance-none text-sm font-medium border rounded py-2 px-2 mb-1 text-gray-800 leading-tight focus:outline-none"
							name="password"
							type="password"
							placeholder=""
							v-model="password"
						/>
						<span v-if="isPasswordError.isError" class="text-red-500 text-xs">{{
							isPasswordError.message
						}}</span>

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
import { register } from "../../services/AuthService";
import { useStore } from "vuex";

export default {
	components: { BaseAuthForm },
	setup() {
		const store = useStore();
		const router = useRouter();

		const username = ref("");
		const email = ref("");
		const password = ref("");

		const submitErrors = ref([]);
		const submitFailed = ref(false);

		const isUsernameError = computed(() => {
			if (submitErrors.value.includes("username_empty")) {
				return {
					isError: 1,
					message: "Поле не должно быть пустым",
				};
			} else if (submitErrors.value.includes("username_taken")) {
				return {
					isError: 1,
					message: "Такое имя пользователя уже занято",
				};
			} else if (submitErrors.value.includes("username_short")) {
				return {
					isError: 1,
					message: "Не должно быть короче 5 символов",
				};
			} else {
				return {
					isError: 0,
					message: "",
				};
			}
		});

		const isEmailError = computed(() => {
			// if (submitErrors.value.includes("email_empty")) {
			// 	return {
			// 		isError: 1,
			// 		message: "Поле не должно быть пустым",
			// 	};
			// } else
			if (submitErrors.value.includes("email_incorrect")) {
				return {
					isError: 1,
					message: "Некорректный формат электронной почты",
				};
			} else if (submitErrors.value.includes("email_taken")) {
				return {
					isError: 1,
					message: "Такой e-mail уже используется",
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
			} else if (submitErrors.value.includes("password_short")) {
				return {
					isError: 1,
					message: "Пароль не должен быть короче 8 символов",
				};
			} else {
				return {
					isError: 0,
					message: "",
				};
			}
		});

		function submitForm() {
			submitFailed.value = false;
			submitErrors.value = [];

			if (username.value === "") {
				submitErrors.value.push("username_empty");
			} else if (username.value.length < 5) {
				submitErrors.value.push("username_short");
			}

			// if (email.value === "") {
			// 	submitErrors.value.push("email_empty");
			// }

			if (password.value === "") {
				submitErrors.value.push("password_empty");
			} else if (password.value.length < 8) {
				submitErrors.value.push("password_short");
			}

			if (!submitErrors.value.length) {
				const userCredentials = {
					username: username.value,
					email: email.value,
					password: password.value,
				};

				console.log("delaetsya zapros na server - register");

				register(userCredentials)
					.then((res) => {
						if (res.status === 400) {
							submitErrors.value = res.data;
						} else if (res.status === 500) {
							submitFailed.value = true;
						}
						// если ошибок от БД нет
						else {
							console.log("зарегистрировался! Перенаправляю на главную!");
							console.log("do kommita roli v state " + store.state.role);
							store.commit("logIn", "admin");
							console.log("posle kommita roli v state " + store.state.role);
							router.replace("/");
						}
					})
					.catch((error) => {
						// если произошла ошибка, независящая от пользователя
						console.log(error);
						submitFailed.value = true;
					});
			}
		}
		return {
			BaseAuthForm,
			username,
			email,
			password,
			isUsernameError,
			isEmailError,
			isPasswordError,
			submitFailed,
			submitForm,
		};
	},
};
</script>
