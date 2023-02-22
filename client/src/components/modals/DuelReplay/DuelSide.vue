<template>
  <div class="w-[270px] h-[400px] text-slate-900" :class="bgColor">
    <template v-if="thisGuy">
      {{ thisGuy.name }}
      <div class="flex flex-col">
        <h1>Hits   :{{ thisGuy.hits }} / {{ thisGuy.maxHits }} </h1> 
        <h1>Morale :{{ thisGuy.morale }} / {{ thisGuy.maxMorale }}</h1> 
        <h1>Stamina:{{ thisGuy.stamina }} / {{ thisGuy.maxStamina }}</h1> 
      </div>
      <div>
        <template v-if="thisGuy.dmg">
          Dmg:{{ thisGuy.dmg }}
        </template>
      </div>
      <Character />
    </template>
  </div>
</template>

<script setup>
  import { defineProps,toRef } from "vue";
  import Character from "./../../Character.vue"
  const props = defineProps(['glad'])
  const thisGuy = toRef(props, 'glad')
  const bgColor = thisGuy.value.idKey == 1 ? "bg-blue-400" :  "bg-red-400"
  console.log("Aside getting:",thisGuy.value);
</script>

<style lang="scss" scoped>

</style>