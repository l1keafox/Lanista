<template>
  <div>
    <BaseFooter>
      <button
        class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        v-on:click="$emit('closeModal')"
      >
        Close
      </button>
    </BaseFooter>
  </div>
</template>

<script setup>
import BaseFooter from "../BaseFooter.vue";
</script>

<style scoped></style>
