<template>
  <div class="bg-cyan-200" @mouseover="showToolTip(toolTip)" @mouseleave="hideToolTip()">
    <slot/>
  </div>
  <div v-if="showItemModal">
    <ItemCardDetail :item="data" @closeModal="showItemModal = false"/>
  </div>
</template>

<script setup>
import {defineProps,inject,toRefs} from "vue"

const hideToolTip = inject('hideToolTip')
const showToolTip = inject('showToolTip')

const props = defineProps({
  toolTip:{
    
  } // this should be an function given. but just an msg for now.
})
const{toolTip} = toRefs(props)


</script>

<style scoped>

</style>