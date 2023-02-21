<template>
  <baseModal>
    <template v-slot:header>
      <h1> Enter a Gladiator </h1>
    </template>

    <template v-slot:content>
      <h1> Here we should show a options of all gladiators </h1>
    </template>

    <template v-slot:footer>
      <h1>Footer</h1>
    </template>
  </baseModal>
</template>

<script setup>
import baseModal from "./baseModal.vue"

</script>

<style scoped>

</style>