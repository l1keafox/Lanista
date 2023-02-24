<template>
  <div class="w-[270px] h-[400px] text-slate-900" :class="bgColor">
    <template v-if="thisGuy">
      <!-- {{ thisGuy.name }} -->
      <div class="flex flex-col">
        <pointsBar :bgcolor="'#6a1b9a'" :now="thisGuy.hits" :max="thisGuy.maxHits" > H:{{ thisGuy.hits }}  </pointsBar>
        <pointsBar :bgcolor="'#ffaa00'" :now="thisGuy.morale" :max="thisGuy.maxMorale" > M:{{ thisGuy.morale }} </pointsBar>
        <pointsBar :bgcolor="'#aaffff'" :now="thisGuy.stamina" :max="thisGuy.maxStamina"> S:{{ thisGuy.stamina }}  </pointsBar>
      </div>
      <div>
      </div>
      <Character :gladName="thisGuy.id" animation="stand" class="h-[16rem] w-[16rem] bottom-16"/>
      <ClashDetail :roundInfo="roundInfo" class=" bg-yellow-100 " />
      <template v-if="thisGuy.dmg" >
        <Popup :dmg="thisGuy.dmg" class="pup "/>
      </template>
  </template>
  </div>
</template>

<script setup>
  import { defineProps,toRef } from "vue";
  import Character from "./../../Character.vue"
  import ClashDetail from "./ClashDetail.vue"
  import pointsBar from "./pointsBar.vue";
  import Popup from "./PopupBase.vue"

  const props = defineProps(['glad','roundInfo'])
  const roundInfo = toRef(props, 'roundInfo')
  const thisGuy = toRef(props, 'glad')
  const bgColor = thisGuy.value.idKey == 1 ? "bg-blue-400" :  "bg-red-400"
  const bot = "10rem";
  const left = "8rem"
  console.log("Aside getting:",thisGuy.value.id);
  // We should do a fetch for clothes for this guy?
</script>

<style lang="scss" scoped>

</style>