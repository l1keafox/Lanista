<template>
  <div>
    <template v-if="thisDetails,thisDetails.c">
      
        
      
    <h1 >
      {{ 
      thisDetails.c.a
     }}
    </h1>
     {{ 
      thisDetails.c.e
     }}
    </template>
    <hr/>
  </div>
</template>

<script setup>
  import { defineProps,toRef } from "vue";
  const props = defineProps(['roundInfo'])
  const thisDetails = toRef(props, 'roundInfo')
</script>

<style scoped>

</style>