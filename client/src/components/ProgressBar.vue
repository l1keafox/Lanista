<template>
  <div class="container">
    <div :style="fillerStyles">
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  bgcolor: {
    type: String,
  },
  completed: {
    type: Number,
  },
});

const fillerStyles = computed(() => {
  return {
    height: "100%",
    width: `${props.completed}%`,
    backgroundColor: props.bgcolor,
    // borderRadius: "inherit",
    textAlign: "right",
  };
});
</script>

<style scoped>
.container {
  height: 20px;
  width: 100px;
  background-color: rgb(30 58 138);
  margin: 50px;
}
</style>
