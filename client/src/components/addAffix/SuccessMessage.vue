<template>
  <div>
    <div class="my-8">
      <!-- <img
          src="../assets/icons/check-circle.svg"
          alt="success"
          class="block mx-auto w-8 md:w-16 pb-8"
        /> -->
      <div class="text-6xl text-center pb-10">👌</div>
      <div class="font-semibold text-2xl text-center">Успешно добавлен!</div>
    </div>
    <div class="text-center mb-8">
      <span
        @click="$emit('switch-success', false)"
        class="text-blue-700 font-medium cursor-pointer"
        >Добавить еще один</span
      >
      или
      <router-link to="/affixes" class="text-blue-700 font-medium"
        >перейти к списку</router-link
      >
    </div>
  </div>
</template>

<script>
export default {
  setup() {},
};
</script>
