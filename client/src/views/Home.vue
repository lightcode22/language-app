<template>
	<div class="w-auto">
		<TheBanner />
		<CategoriesBlock />
	</div>
</template>

<script>
import TheBanner from "../components/homepage/TheBanner";
import CategoriesBlock from "../components/homepage/CategoriesBlock.vue";

export default {
	name: "Homepage",
	components: {
		TheBanner,
		CategoriesBlock,
	},
	setup() {
		return { TheBanner, CategoriesBlock };
	},
};
</script>
