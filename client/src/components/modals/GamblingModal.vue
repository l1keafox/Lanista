<template>
  <BaseModal>
    <template v-slot:header>
      <h1> Enter a Gladiator </h1>
    </template>

    <template v-slot:content>
      <h1> Here we should show a options of all gladiators </h1>
    </template>

    <template v-slot:footer>
      <h1>Footer</h1>
    </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from "./BaseModal.vue"

</script>

<style scoped>

</style>
