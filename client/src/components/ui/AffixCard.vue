<template>
	<router-link :to="link">
		<div class="rounded-md bg-white shadow-lg h-44 p-2">
			<div
				class="h-1/2 grid place-content-center font-medium text-4xl korean-font"
			>
				{{ affix.korean }}
			</div>
			<div class="h-1/2 grid place-content-center">{{ affix.meaning }}</div>
		</div>
	</router-link>
</template>

<script>
export default {
	props: ["data"],
	setup(props) {
		const affix = { ...props.data };
		const link = `/affixes/${affix.roman}`;
		return { affix, link };
	},
};
</script>
