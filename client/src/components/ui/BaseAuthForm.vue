<template>
	<div class="card bg-white rounded-md shadow-lg w-96">
		<div class="text-center font-medium text-lg pb-10 pt-10 uppercase">
			{{ headerText }}
		</div>

		<form @submit.prevent="submitAuthForm" class="px-5 lg:px-10 mb-8 mt-4">
			<slot></slot>

			<div class="text-center">
				<button class="focus:outline-none">
					<base-button
						class="bg-red-500 hover:bg-red-600 text-white font-medium text-sm"
						:class="
							formAction === 'login'
								? 'bg-red-500 hover:bg-red-600'
								: 'bg-blue-500 hover:bg-blue-600'
						"
						type="button"
					>
						{{ buttonText }}
					</base-button>
				</button>
			</div>
		</form>
		<div class="text-xs font-normal text-center inset-x-0 bottom-0 pb-4">
			{{ footerText }}
			<router-link :to="formAction === 'login' ? '/register' : '/login'"
				><span
					:class="formAction === 'login' ? 'text-red-600' : 'text-blue-600'"
					class="font-medium  cursor-pointer text-xs"
					>{{ linkText }}</span
				></router-link
			>
		</div>
	</div>
</template>

<script>
import BaseButton from "../ui/BaseButton.vue";

export default {
	props: ["headerText", "buttonText", "footerText", "linkText", "formAction"],
	emits: ["submitted"],
	setup(_, { emit }) {
		function submitAuthForm() {
			emit("submitted", "true");
		}
		return { BaseButton, submitAuthForm };
	},
};
</script>

<style scoped></style>
