<template>
  <BaseModal noFooter="true">
    <template v-slot:header>
      <h1 v-if="item"> {{item.type}} </h1>
    </template>

    <template v-slot:content>
      <div v-if="item" class="p-4"> 
        <h2> SLOT : {{ item.slot }}</h2>
        <h1> Abilities: </h1>
        <div v-for="abi in item.abilities" class="flex flex-col "> 
          
            <h3 class="bg-yellow-200 text-center">{{ abi }}</h3>
        </div>
          <!-- {{ item }} -->
      </div>
    </template>

    <template v-slot:footer>
    </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from "./BaseModal.vue"

import { defineProps,reactive,inject,ref } from "vue";

const apiCall = inject('apiCall')
const {item} = defineProps({
  item: Object
})


console.log(item);
</script>

<style scoped>

</style>
