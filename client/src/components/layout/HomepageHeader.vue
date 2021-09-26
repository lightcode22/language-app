<template>
	<div class="w-auto bg-blue-100">
		<nav
			class="flex flex-col items-center sm:flex-row sm:justify-between sm:h-20 list-none"
		>
			<li class="text-center">
				<!-- <div class="sm:-mt-1"> -->
				<router-link to="/"
					><span class="font-semibold text-red-500 text-lg sm:text-xl"
						>app</span
					>
				</router-link>
				<!-- </div> -->
			</li>

			<li>
				<login-badge
					class="shadow-lg md:shadow-none px-4 sm:py-0 flex sm:px-0"
				></login-badge>
			</li>
		</nav>
	</div>
</template>

<script>
import LoginBadge from "../homepage/LoginBadge.vue";

export default {
	components: {
		LoginBadge,
	},
	setup() {
		return { LoginBadge };
	},
};
</script>
