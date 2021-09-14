<template>
	<div class="w-1/2 mx-auto bg-white shadow-lg p-8">
		<AffixForm v-if="!isSuccessfullyPosted" @switch-success="successToFail" />
		<SuccessMessage v-else @switch-success="successToFail" />
	</div>
</template>

<script>
import { ref } from "vue";
import AffixForm from "../components/addAffix/AffixForm";
import SuccessMessage from "../components/addAffix/SuccessMessage";

export default {
	components: { AffixForm, SuccessMessage },
	setup() {
		const isSuccessfullyPosted = ref(false);

		function successToFail(result) {
			isSuccessfullyPosted.value = result;
		}

		return {
			AffixForm,
			SuccessMessage,
			isSuccessfullyPosted,
			successToFail,
		};
	},
};
</script>
