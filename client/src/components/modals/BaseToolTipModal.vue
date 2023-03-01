<template>
    <div id="toolTip" class="cursor-disabled fixed text-black bg-white z-50">
      <h1 v-if="message" class="m-2"> {{message}} </h1>
    </div>
</template>

<script setup>
import {onMounted,reactive,toRefs} from 'vue'
import { useMouse } from '@vueuse/core'
const props = defineProps({
  message:{
  }
})

const {message} = toRefs(props);

onMounted(()=>{
  const mouse = reactive(useMouse())
  const infoEle = document.getElementById("toolTip")
  setTimeout(()=>{
      infoEle.style.left = `${mouse.x+15}px`;
      infoEle.style.top = `${mouse.y}px`;
  },75)
})

</script>

<style scoped>
</style>