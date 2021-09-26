<template>
	<div class="w-auto montserrat">
		<div class="flex justify-between mb-12 mt-3">
			<span>Результатов: {{ count }}</span>
			<div>
				<input
					class="border-2 border-black"
					value="здесь будет поисковая строка"
				/>
			</div>
			<div v-if="isAllowedToAdd" class="">
				<router-link to="/affixes/addAffix"
					><base-button
						class="font-medium bg-blue-500 text-white hover:bg-blue-400"
						>Добавить новый</base-button
					></router-link
				>
			</div>
		</div>

		<div>
			<ul v-if="count" class="grid md:grid-cols-6 md:gap-20">
				<li v-for="affix in affixes" :key="affix._id">
					<AffixCard :data="affix" />
				</li>
			</ul>

			<div v-else class="text-center mt-32 md:mt-48">
				<span class="w-full inline-block text-5xl mb-8">🤷‍♂️</span>
				<span class="w-full inline-block text-lg font-medium">Пусто...</span>
			</div>
		</div>
	</div>
</template>

<script>
import { computed, ref, onMounted } from "vue";
import AffixCard from "../components/ui/AffixCard";
import BaseButton from "../components/ui/BaseButton";
import { getAll } from "../../services/AffixService";
import { useStore } from "vuex";

export default {
	setup() {
		const store = useStore();

		const affixes = ref([]);

		const allAffixes = computed(() => {
			return affixes.value.affixes;
		});

		const affixesCount = computed(() => {
			return affixes.value.result;
		});

		const isAllowedToAdd = computed(() => {
			return ["moderator", "admin"].includes(store.state.role);
		});

		onMounted(() => {
			getAllAffixes();
		});

		async function getAllAffixes() {
			try {
				affixes.value = await getAll();
			} catch (err) {
				console.log("ошибка произошла");
			}
		}

		return {
			affixes: allAffixes,
			count: affixesCount,
			AffixCard,
			BaseButton,
			isAllowedToAdd,
		};
	},
};
</script>
