<template>
  <label v-if="label" class="text-white"> {{ label }}</label>

  <input
  v-bind="$attrs"
  :placeholder="label"
  class="field"
  :value="modelValue"
  @input="$emit('update:modelValue',$event.target.value)"
  >

  <p v-if="error" class="errorMessage text-sm">
    {{  error }}
  </p>
</template>

<script setup>
const { label, modelValue , error } = defineProps({
  label: {
    type: String,
    default: ''
  },
  modelValue: {
    type: [String,Number],
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
})
</script>
<style scoped>
.errorMessage {
  color: red;
}
input{
  overflow: visible;
}
</style>