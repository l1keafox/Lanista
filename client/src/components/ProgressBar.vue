<template>
  <div class="container">
    <div :style="fillerStyles">
      <!-- <span class="label">{{ `${completed}%` }}</span> -->
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
export default {
  name: "ProgressBar",
  props: {
    bgcolor: String,
    completed: Number,
  },
  setup(props) {
    const fillerStyles = computed(() => {
      return {
        height: "100%",
        width: `${props.completed}%`,
        backgroundColor: props.bgcolor,
        // borderRadius: "inherit",
        textAlign: "right",
      };
    });

    return { fillerStyles };
  },
};
</script>


<style scoped>
.container {
  height: 20px;
  width: 100px;
  background-color: #e0e0de;
  margin: 50px;
}

.label {
  padding: 5px;
  color: white;
  font-weight: bold;
}
</style>
