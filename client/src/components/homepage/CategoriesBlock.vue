<template>
	<section class="mt-8 mb-2">
		<h3 class="my-4 text-xl font-semibold">Категории</h3>

		<ul
			class="grid grid-cols-2 gap-x-4 justify-items-stretch md:grid-cols-4 md:gap-x-9"
		>
			<li v-for="(category, index) in categories" :key="index">
				<router-link to="/affixes">
					<base-card
						class="bg-white text-base text-black shadow-lg h-52 md:h-60 p-2"
					>
						{{ category }}
					</base-card>
				</router-link>
			</li>
		</ul>
	</section>
</template>

<script>
import BaseCard from "../ui/BaseCard";

export default {
	setup() {
		const categories = ["Аффиксы", "Фразы", "Статьи", "🤷‍♂️ В чем отличие...?"];

		return { BaseCard, categories };
	},
};
</script>
