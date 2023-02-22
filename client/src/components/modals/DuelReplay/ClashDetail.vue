<template>
  <div>
    <h1>
      {{ 
      thisDetails.c.a
     }}
    </h1>
     {{ 
      thisDetails.c.e
     }}
     <hr/>
     <template v-if="thisDetails.e.dmg">
      damage:
      {{ 
      thisDetails.e.dmg
      }}
      </template>
  </div>
</template>

<script setup>
  import { defineProps,toRef } from "vue";
  const props = defineProps(['details'])
  const thisDetails = toRef(props, 'details')
</script>

<style scoped>

</style>