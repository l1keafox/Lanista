<template>
  <div class="bg-cyan-200" @mouseover="showToolTip(mouse)" @mouseleave="hideToolTip()">
    <slot/>
  </div>
</template>

<script setup>
import {defineProps,inject,toRefs} from "vue"

const hideToolTip = inject('hideToolTip')
const showToolTip = inject('showToolTip')

const props = defineProps({
  mouse:{
    default:"yo"
  } // this should be an function given. but just an msg
})
const{mouse} = toRefs(props)


</script>

<style scoped>

</style>