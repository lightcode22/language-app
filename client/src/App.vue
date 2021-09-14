<template>
	<main class="container mx-auto">
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

/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
} */
</style>
