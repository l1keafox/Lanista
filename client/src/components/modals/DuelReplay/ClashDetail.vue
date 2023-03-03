<template>
  <div>
    <template v-if="roundInfo,roundInfo.c">
      
        
      
    <h1 >
      {{ 
        roundInfo.c.a
     }}
    </h1>
     {{ 
      roundInfo.c.e
     }}
    </template>
    <hr/>
  </div>
</template>

<script setup>
  import { defineProps,toRef } from "vue";
  const props = defineProps(['roundInfo'])
  const roundInfo = toRef(props, 'roundInfo')
</script>

<style scoped>

</style>