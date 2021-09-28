<template>
	<div>
		<TagButton
			v-for="tag of tags"
			:content="tag"
			@switch="switchFilter"
			:key="tag.textContent"
		/>
	</div>
</template>

<script>
import { ref, watch } from "vue";
import TagButton from "../ui/TagButton.vue";

export default {
	props: [],
	setup(_, context) {
		let tags = ref([
			{
				textContent: "пользователи",
				active: "bg-blue-500",
			},
			{
				textContent: "модераторы",
				active: "bg-red-500",
			},
			{
				textContent: "администраторы",
				active: "bg-yellow-500",
			},
		]);

		const filters = ref({
			userFilter: true,
			moderatorFilter: true,
			adminFilter: true,
		});

		const switchFilter = (filtername) => {
			if (filtername === "пользователи") {
				filters.value.userFilter = !filters.value.userFilter;
			} else if (filtername === "модераторы") {
				filters.value.moderatorFilter = !filters.value.moderatorFilter;
			} else if (filtername === "администраторы") {
				filters.value.adminFilter = !filters.value.adminFilter;
			}
		};

		watch(filters.value, (newFilters) => {
			const activeFilters = [];

			for (const [key, val] of Object.entries(newFilters)) {
				if (val) activeFilters.push(key);
			}

			context.emit("filtersChange", activeFilters);
		});

		return {
			tags,
			TagButton,
			switchFilter,
			filters,
		};
	},
};
</script>
