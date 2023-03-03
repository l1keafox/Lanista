<template>
  <div class="w-[270px] h-[400px] text-slate-900" :class="bgColor">
    <button class="bg-red-500 w-1/3" @click="showStats"> Stats </button>
    <template v-if="thisGuy">
      <!-- {{ thisGuy.name }} -->
      <div class="flex flex-col">
        <pointsBar :bgcolor="'#6a1b9a'" :now="thisGuy.hits" :max="thisGuy.maxHits" > H:{{ thisGuy.hits }}  </pointsBar>
        <pointsBar :bgcolor="'#ffaa00'" :now="thisGuy.morale" :max="thisGuy.maxMorale" > M:{{ thisGuy.morale }} </pointsBar>
        <pointsBar :bgcolor="'#aaffff'" :now="thisGuy.stamina" :max="thisGuy.maxStamina"> S:{{ thisGuy.stamina }}  </pointsBar>
      </div>
      <div>
      </div>
      <template v-if="gladiatorData">
        <Character  :clothes="makeClothes(gladiatorData)" v-model="animate" :gladName="props.glad.idKey+''" :animation="anime" :direction="dir" class="h-[16rem] w-[16rem] bottom-16"/>
      </template>
      <ClashDetail :roundInfo="roundInfo" class=" bg-yellow-100 " />
      <template v-if="thisGuy.dmg" >
        {{ thisGuy.dmg }}
        <!-- <Popup :dmg="thisGuy.dmg" class="pup "/> -->
      </template>
  </template>
</div>
</template>

<script setup>
  import { defineProps,toRef,inject,onMounted,ref,onUpdated } from "vue";
  import Character from "./../../Character.vue"
  import ClashDetail from "./ClashDetail.vue"
  import pointsBar from "./pointsBar.vue";
  import Popup from "./PopupBase.vue"

  const props = defineProps(['glad','roundInfo'])
  console.log(props.glad.idKey);
  const roundInfo = toRef(props, 'roundInfo')
  const thisGuy = toRef(props, 'glad')
  const bgColor = thisGuy.value.idKey == 1 ? "bg-blue-400" :  "bg-red-400"
  const dir = thisGuy.value.idKey == 1 ? "right" :  "left"
  const gladId = thisGuy.id + thisGuy.value.idKey == 1 ? "right" :  "left" ;
  const bot = "10rem";
  const left = "8rem"
  const animate = ref([]);
  const anime = ref('idle')

  onUpdated(()=>{
    if(roundInfo && roundInfo.value && roundInfo.value.c){
      // animate.value.push(roundInfo.value.c.a)
      console.log("NEW ROUND?",roundInfo.value.c.a);
      const animeMap ={
        "stab":"thrust",
        "slash":"slash1",
        "smash":"slash2",

        "block":"bash",
        "dodge":"dodge",
        "feint":"lunge",
        "taunt":"crouch",
        "provoke":"move",
        "insult":"draw"
      }

      anime.value = animeMap[roundInfo.value.c.a.toLowerCase()]
    }
  })

  const gladiatorData = ref(null)
  function makeClothes(glad){
    if(glad){
      return { hair:glad.hairChar, style:glad.hairStyleChar, skin:glad.skinChar, sex:glad.sexChar, body:1 }
    }
  }

  const apiCall = inject('apiCall')
    onMounted( async ()=>{
    const rpnse = await fetch(
          apiCall.value + `/gladiator/${thisGuy.value.id}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        gladiatorData.value = await rpnse.json();
        makeClothes(gladiatorData)
  })
  async function showStats(){
    console.log('Showing stats for ',thisGuy.value.id,gladiatorData);
          
  }
  // We should do a fetch for clothes for this guy?
</script>

<style lang="scss" scoped>

</style>