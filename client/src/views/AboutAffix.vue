<template>
	<div class="w-auto montserrat">
		<section class="h-64 bg-blue-50 flex items-center">
			<div class="text-9xl korean-font mx-auto">{{ info.korean }}</div>
		</section>
		<section class="w-1/2 mx-auto border-0 border-black text-gray-900">
			<h2 class="font-semibold text-2xl pt-8">{{ info.meaning }}</h2>
			<div
				class="
					font-medium
					text-justify
					leading-8
					pt-8
					text-lg
					whitespace-pre-line
				"
			>
				{{ info.description }}
			</div>
		</section>
	</div>
</template>

<script>
import { ref, onMounted } from "vue";
import { getOne } from "../../services/AffixService";

export default {
	props: ["id"],
	setup(props) {
		const info = ref([]);

		onMounted(() => {
			getInfo();
		});

		async function getInfo() {
			try {
				info.value = await getOne(props.id);

				info.value.korean = info.value.korean
					.split("/")
					.map((el) => "~" + el.trim())
					.join(" / ");
			} catch (err) {
				console.log(err);
			}
		}

		return { info };
	},
};
</script>
