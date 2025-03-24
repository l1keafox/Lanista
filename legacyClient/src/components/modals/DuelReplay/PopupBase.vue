<template>
  <div v-if="showSelf" v-bind="$attrs">
    <!-- <div :style="fillerStyles" class="rounded"> -->
    <span class="label">
      {{ msg }}
    </span>

    <!-- </div> -->
  </div>
</template>

<script setup>
const showSelf = ref(true);

const props = defineProps({
  bgcolor: {
    type: String,
  },
  dmg: {
    type: Object,
  },
});
const msg = ref("");
const { dmg } = toRefs(props);

function update() {
  if (dmg.value.h) {
    msg.value = `-${dmg.value.h}:hp`;
  } else if (dmg.value.s > 0) {
    msg.value = `-${dmg.value.s}:sta`;
  } else if (dmg.value.m) {
    msg.value = `-${dmg.value.m}:mor`;
  } else {
    showSelf.value = false;
  }
}
let remove = 2000;
update();
onUpdated(() => {
  // text content should be the same as current `count.value`
  console.log("upda?");
  update();
  remove = 2000;
});

setInterval(() => {
  // this is where we should trigger the removal.
  remove -= 100;
  console.log("upda?", remove, showSelf.value);
  if (remove < 0) {
    showSelf.value = false;
  }
}, 100);
</script>

<style scoped>
.container {
  height: 40px;
  width: 40px;

  background-color: #e0e0de;
}
@keyframes redGlow {
  0% {
    opacity: 100;
  }
  100% {
    opacity: 0;
  }
}
.label {
  padding: 5px;
  background-color: #f00;
  color: white;
  font-weight: bold;
}
</style>
animation: redGlow 5s ease-in-out;
