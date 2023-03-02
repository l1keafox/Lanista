<template>
  <div @mouseover="showToolTip(toolTip)" @mouseleave="hideToolTip()">
    <slot/>
  </div>
</template>

<script setup>
import {defineProps,inject,toRefs} from "vue"

const hideToolTip = inject('hideToolTip')
const showToolTip = inject('showToolTip')

const props = defineProps({
  toolTip:{} // this should be an function given.
})
const{toolTip} = toRefs(props)


</script>

<style scoped>

</style>