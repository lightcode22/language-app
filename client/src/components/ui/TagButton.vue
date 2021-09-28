<template>
	<div
		@click="[$emit('switch', text), toggleActive()]"
		class="font-medium text-sm bg text-white inline-block rounded-md mx-4 py-1 px-2 select-none cursor-pointer"
		:class="[isActive ? active : 'bg-gray-300']"
	>
		{{ text }}
	</div>
</template>

<script>
import { ref } from "vue";

export default {
	props: ["content"],
	setup(props) {
		const tagInfo = ref(props.content);

		const isActive = ref(true);

		const toggleActive = () => {
			isActive.value = !isActive.value;
			console.log(`${tagInfo.value.textContent} - ${isActive.value}`);
		};

		return {
			isActive,
			toggleActive,
			text: tagInfo.value.textContent,
			active: tagInfo.value.active,
		};
	},
};
</script>
