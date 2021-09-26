<template>
	<main class="container mx-auto p-4 md:p-0 monserrat">
		<router-view name="header"></router-view>
		<router-view name="main"></router-view>
		<!-- <Footer /> -->
	</main>
</template>

<script>
import Footer from "./components/layout/Footer.vue";
import "./assets/tailwind.css";
export default {
	setup() {
		return { Footer };
	},
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap");

* {
	box-sizing: border-box;
}

body {
	background-color: #f8fafc;
}

.korean-font {
	font-family: "Noto Sans KR", sans-serif;
}

.montserrat {
	font-family: "Montserrat", sans-serif;
}
</style>
