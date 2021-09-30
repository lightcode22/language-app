<template>
	<div>
		<TagButton
			v-for="tag of tags"
			:content="tag"
			:isActive="filters[tag.name]"
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
		const filters = ref({
			userFilter: true,
			moderatorFilter: true,
			adminFilter: true,
		});

		let tags = ref([
			{
				textContent: "пользователи",
				activeClass: "bg-blue-500",
				name: "userFilter",
			},
			{
				textContent: "модераторы",
				activeClass: "bg-red-500",
				name: "moderatorFilter",
			},
			{
				textContent: "администраторы",
				activeClass: "bg-yellow-500",
				name: "adminFilter",
			},
		]);

		const switchFilter = (filtername) => {
			filters.value[filtername.name] = filtername.activity;
			console.log(filters.value[filtername.name]);
		};

		watch(filters.value, (newFilters) => {
			const activeFilters = Object.entries(newFilters)
				.filter((n) => n[1])
				.map((n) => n[0]);

			// если все фильтры отключены (все тэги выключены) - то снова включить все фильтры/тэги
			if (!activeFilters.length) {
				Object.keys(filters.value).forEach(
					(key) => (filters.value[key] = true)
				);
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
