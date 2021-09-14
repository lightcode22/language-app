<template>
	<section class="my-2">
		<base-card class="the-banner px-4 py-3 h-48 flex flex-row items-center"
			><div class="text-white text-3xl mx-auto">
				BANNER PLACEHOLDER
			</div></base-card
		>
	</section>
</template>

<script>
import BaseCard from "../ui/BaseCard.vue";

export default {
	components: { BaseCard },
	setup() {
		return { BaseCard };
	},
};
</script>

<style scoped>
.the-banner {
	background: #f54a4a;
	background: linear-gradient(
		135deg,
		rgba(251, 96, 104, 1) 0%,
		rgba(250, 75, 84, 1) 100%
	);
}
</style>
