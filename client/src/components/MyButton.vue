<template>
  <button :class = "classString">
    {{ text }}
  </button>
</template>

<script setup>

const { text, color , hover } = defineProps({
  text: String,
  color: String,
  hover: String
})

const classString = `${color} text-lg border-2 hover:shadow-xl	text-white hover:text-black font-bold py-2 px-4 rounded mb-3 hover:${hover} hover:scale-105`
</script>

<style scoped>
button{
  transition: all .5s ease;
}
</style>