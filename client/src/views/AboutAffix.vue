<template>
	<div>{{ info.korean }}</div>
</template>

<script>
import { ref, onMounted } from "vue";
import { getOne } from "../../services/AffixService";

export default {
	props: ["id"],
	setup(props) {
		const info = ref([]);
		onMounted(async function() {
			try {
				info.value = await getOne(props.id);
			} catch (err) {
				console.log(err);
			}
		});
		return { info };
	},
};
</script>
