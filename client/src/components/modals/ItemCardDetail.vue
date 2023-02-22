<template>
  <BaseModal>
    <template v-slot:header>
      <h1 v-if="item"> {{item.type}} </h1>
    </template>

    <template v-slot:content>
      <h1 v-if="item"> 
        {{ item }}
      </h1>
    </template>

    <template v-slot:footer>
    </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from "./BaseModal.vue"
import { defineProps,reactive,inject,ref } from "vue";

const {item} = defineProps({
  item: Object
})

console.log(item);
</script>

<style scoped>

</style>
