<template>
	<div>
		<h1
			class="uppercase text-center font-semibold text-md montserrat mb-14 mt-4"
		>
			Добавить новый аффикс
		</h1>

		<form @submit.prevent="submitNewAffix">
			<div class="grid grid-cols-2 gap-x-16">
				<div class="mb-8">
					<label class="block mb-1 font-medium" for="korean">Аффикс</label>
					<input
						class="border border-gray-900 rounded-lg w-full py-1 px-2"
						id="aff-kor"
						type="text"
						name="korean"
						placeholder="** / **"
						v-model="korean"
					/>
					<p
						:style="{ opacity: isKoreanError.isError }"
						class="text-sm text-red-500"
					>
						{{ isKoreanError.message }}
					</p>
				</div>

				<div class="mb-8">
					<label class="block mb-1 font-medium" for="meaning">Значение</label>
					<input
						class="border border-gray-900 rounded-lg w-full py-1 px-2"
						id="aff-mean"
						type="text"
						name="meaning"
						placeholder="**, **, **"
						v-model="meaning"
					/>
					<p
						:style="{ opacity: isMeaningError.isError }"
						class="text-sm text-red-500"
					>
						{{ isMeaningError.message }}
					</p>
				</div>

				<div class="mb-8">
					<label class="block mb-1 font-medium" for="roman">Романизация</label>
					<input
						class="border border-gray-900 rounded-lg w-full py-1 px-2"
						id="aff-rom"
						type="text"
						name="roman"
						placeholder="**-**"
						v-model="roman"
					/>
					<p
						:style="{ opacity: isRomanError.isError }"
						class="text-sm text-red-500"
					>
						{{ isRomanError.message }}
					</p>
				</div>

				<div class="mb-8 col-span-2">
					<label class="block mb-1 font-medium" for="description"
						>Описание</label
					>
					<textarea
						class="
							border border-gray-900
							rounded-lg
							w-full
							resize-none
							h-40
							p-2
						"
						id="desc"
						type="text"
						name="description"
						v-model="description"
					></textarea>
				</div>
			</div>

			<div class="col-span-2 mx-auto w-24">
				<button>
					<base-button
						class="
							rounded-md
							py-2
							px-4
							text-center text-sm
							bg-blue-500
							hover:bg-blue-400
							text-white
							font-medium
						"
						>Добавить</base-button
					>
				</button>
			</div>
		</form>

		<span v-if="submitFailed" class="bg-red-300">
			Что-то явно пошло не по плану
		</span>
	</div>
</template>

<script>
import { computed, ref } from "vue";
import { addNew } from "../../../services/AffixService";
import BaseButton from "../ui/BaseButton.vue";

export default {
	emits: ["switch-success"],
	setup(_, { emit }) {
		const korean = ref("");
		const roman = ref("");
		const meaning = ref("");
		const description = ref("");
		const submitErrors = ref([]);
		const submitFailed = ref(false);

		const isKoreanError = computed(() => {
			if (submitErrors.value.includes("korean_taken")) {
				return {
					isError: 1,
					message: "Такой аффикс уже есть в базе данных",
				};
			} else if (submitErrors.value.includes("korean_empty")) {
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

		const isRomanError = computed(() => {
			if (submitErrors.value.includes("roman_taken")) {
				return {
					isError: 1,
					message: "Такая романизация уже используется",
				};
			} else if (submitErrors.value.includes("roman_empty")) {
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

		const isMeaningError = computed(() => {
			if (submitErrors.value.includes("meaning_empty")) {
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

		function submitNewAffix() {
			submitFailed.value = false;
			submitErrors.value = [];

			if (korean.value === "") {
				submitErrors.value.push("korean_empty");
			}
			if (roman.value === "") {
				submitErrors.value.push("roman_empty");
			}

			if (meaning.value === "") {
				submitErrors.value.push("meaning_empty");
			}

			// если на этапе первичной проверки нет ошибок - то добавить в базу данных
			if (!submitErrors.value.length) {
				const newAffix = {
					korean: korean.value,
					roman: roman.value,
					meaning: meaning.value,
					description: description.value,
				};

				addNew(newAffix)
					.then((res) => {
						// если не прошло валидацию Mongo - уникальные поля дублируются
						if (res.response && res.response.status === 400) {
							submitErrors.value = res.response.data;
						} else {
							emit("switch-success", true);
							korean.value = "";
							roman.value = "";
							meaning.value = "";
							description.value = "";
						}
					})
					.catch((error) => {
						submitFailed.value = true;
					});
			}
		}

		return {
			korean,
			roman,
			meaning,
			description,
			isKoreanError,
			isRomanError,
			isMeaningError,
			submitNewAffix,
			submitFailed,
			BaseButton,
		};
	},
};
</script>
