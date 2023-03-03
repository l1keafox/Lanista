<template>
  <div>
    <template v-if="roundInfo,roundInfo.c">
      
        
      
    <h1 >
      {{ 
        roundInfo.c.a
     }}:
     <span v-for="(info,key) in roundInfo.c.e" :key="info">
      {{key}}:{{info}}/
      </span>
    </h1>
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