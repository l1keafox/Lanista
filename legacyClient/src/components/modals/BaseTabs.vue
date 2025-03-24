<template>
  <div
    class="text-sm font-medium text-center text-gray-500 border-gray-200 dark:text-gray-400 dark:border-gray-700"
  >
    <ul class="flex flex-wrap -mb-px">
      <li
        v-for="tab in tabs"
        :key="tab"
        class="-mb-px mr-2 last:mr-0 flex-auto text-center cursor-pointer hover:bg-slate-500 select-none"
      >
        <a
          class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal"
          v-on:click="
            $emit('update:modelValue', tab);
            currentTab = tab;
          "
          v-bind:class="{
            'text-pink-600 bg-white': currentTab !== tab,
            'text-white bg-pink-600': currentTab === tab,
          }"
        >
          {{ tab }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
/*

Props:
tabs - this is going to be an array of tabs.
v-modal - will be needed to bind emits clicks on tabs.

*/

const { tabs, model_value } = defineProps({
  tabs: {
    type: Array,
    default: [],
  },
  model_value: {
    type: String,
  },
});

const currentTab = ref(tabs[0]);
</script>

<style scoped></style>
