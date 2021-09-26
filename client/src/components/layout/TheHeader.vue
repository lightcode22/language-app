<template>
	<div class="w-auto bg-blue-100">
		<nav class="flex items-center flex-row justify-between sm:h-20 list-none">
			<li class="text-center">
				<router-link to="/">
					<span class="font-semibold text-red-500 text-lg sm:text-xl"
						>app</span
					></router-link
				>
			</li>

			<!-- <li>
      <login-user-badge
        class="shadow-lg md:shadow-none px-4 py-3 flex bg-white sm:bg-red-100 sm:px-0"
      ></login-user-badge>
    </li> -->
		</nav>
	</div>
</template>

<script>
export default {
	components: {},
	setup() {
		return {};
	},
};
</script>
