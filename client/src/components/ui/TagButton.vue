<template>
	<div
		@click="toggleActive"
		class="font-medium text-sm bg text-white inline-block rounded-md mx-4 py-1 px-2 select-none cursor-pointer"
		:class="[active ? activeClass : 'bg-gray-300']"
	>
		{{ text }}
	</div>
</template>

<script>
import { ref } from "vue";

export default {
	props: ["content", "isActive"],
	setup(props, context) {
		const tagInfo = ref(props.content);

		const active = ref(props.isActive);

		const toggleActive = () => {
			active.value = !active.value;

			context.emit("switch", { name: tagInfo.value.name, activity: active });
		};

		return {
			active,
			toggleActive,
			text: tagInfo.value.textContent,
			name: tagInfo.value.name,
			activeClass: tagInfo.value.activeClass,
		};
	},
};
</script>
