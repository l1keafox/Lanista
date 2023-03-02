<template>
  <BaseModal >
    <template v-slot:header >
      <div class="text-xl text-black flex justify-between items-center w-full">
        <h1> {{ gladOne.name }} <span v-if="winner == 1" > : Winner</span> </h1>
        <h1>vs </h1>
        <h1><span v-if="winner == 2" > : Winner</span>{{gladTwo.name}}</h1>
      </div>
    </template>

    <template v-slot:content>
      <div class="flex justify-around">
        <DuelSide :glad="gladOne" :roundInfo="report[cIndex][1]"/>
        <div class="w-[300px] flex flex-col justify-center items-center text-black">
            <!-- {{ report[cIndex].R.r }}: -->
            {{ report[cIndex].R.w == 1 ?  "<<<<"+ gladOne.name :   report[cIndex].R.w == 2 ? gladTwo.name + ">>>>" : "" }}
        </div>
        <DuelSide :glad="gladTwo" :roundInfo="report[cIndex][2]"/>
      </div>
    </template>

    <template v-slot:footer>
      <h2 class = "text-4xl text-black absolute left-0 ml-5"> {{ cIndex }} / {{ report.k.rC }} </h2>

      <button
      :class="btnDecor"
      type="button"
      v-on:click="
        cIndex = 0;
        updateStats();
      ">
      Restart
    </button>

    <button
    :class="btnDecor"
    type="button"
      @click="backRound">
      &lt;&lt;
    </button>
    

    <button
    class = "text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
      v-if="!isActive"
      type="button"
      @click="pausePlay">
      play
    </button>

    <button
    class = "bg-transparent border border-solid border-red-300 bg-red-700 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
      type="button"
      v-else
      @click="pausePlay">
      Stop
    </button>

    <button
    :class="btnDecor"
    type="button"
      @click="forwardRound">
      >>
    </button>

    <button
      :class="btnDecor"
      type="button"
      v-on:click="
      cIndex = report.k.rC
        updateStats();
      ">
      End
    </button>      

    </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from "./BaseModal.vue"
import DuelSide from "./DuelReplay/DuelSide.vue"

import { useIntervalFn } from '@vueuse/core'
import { defineProps,reactive,inject,ref,unref } from "vue";

const props = defineProps({
  report: Object,
  duelId: {
    type:String,
    default: ""
  }
})
const btnDecor = "text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"

let report = props.report;
const cIndex = ref(0);

async function blah(duelId){
  const apiCall = inject("apiCall");
  console.log(duelId,"buggy?")
	const rpnse = await fetch(
		apiCall.value + `/gladiator/getDuel/${unref(duelId)}`,
		{ headers: { "Content-Type": "application/json" } }
	);
  let rpns = await rpnse.json();
  return JSON.parse(rpns[0].duel);

}

console.log("DUEL REPLAY getting,",props)
if(props&& props.report && props.report.duel){
  // This means it's an duel report that needs to json it's duel.
  console.log(props.report.duel)
  report =   JSON.parse(props.report.duel)

  console.log(report)
  //return;
}

if (props.duelId) {
  console.log("Before b lah",props.duelId)
  report = await blah(props.duelId)
  console.log(report);
}



const winner = ref("")

console.log("Duel Report :",report,props.duelId);

function doStart(obj,idKey){
  return {
    idKey,
    name: obj.n,
    memory: obj.m,
    maxHits: obj.hp,
    maxMorale: obj.mp,
    id: obj.id,
    maxStamina: obj.sp
  }
}


function updateStats(){
  if(report[cIndex.value][1].e.dmg){
    gladOne.dmg = report[cIndex.value][1].e.dmg;
  } else {
    gladOne.dmg = undefined;
  }
  if(report[cIndex.value][2].e.dmg){
    gladTwo.dmg = report[cIndex.value][2].e.dmg;
  } else {
    gladTwo.dmg = undefined;
  }
  gladOne.hits = report[cIndex.value][1].e.pt.h
  gladTwo.hits = report[cIndex.value][2].e.pt.h

  gladOne.morale = report[cIndex.value][1].e.pt.m
  gladTwo.morale = report[cIndex.value][2].e.pt.m

  gladOne.stamina = report[cIndex.value][1].e.pt.s
  gladTwo.stamina = report[cIndex.value][2].e.pt.s

  if(gladOne.hits <= 0 || gladOne.morale <= 0  || gladOne.stamina <= 0  ){
    winner.value = 2
  }
  if(gladTwo.hits <= 0 || gladTwo.morale <= 0  || gladTwo.stamina <= 0  ){
    winner.value = 1

  }
}


const gladOne = reactive(doStart(report.k[1],1));
const gladTwo = reactive(doStart(report.k[2],2));

// hard coding round 0, 
report[0] = {
  1:{
    e: {
      pt:{
        h: gladOne.maxHits,
        m: gladOne.maxMorale,
        s: gladOne.maxStamina
      }
    }
  },
  2:{
    e: {
      pt:{
        h: gladTwo.maxHits,
        m: gladTwo.maxMorale,
        s: gladTwo.maxStamina
      }
    }
  },
  R:{
    r: "t"
  }
}
updateStats();

function backRound(){
			cIndex.value--;
			if (cIndex.value < 0) cIndex.value = 0;
			updateStats();
}

const { pause, resume, isActive } = useIntervalFn(() => {
  forwardRound();
}, 2000)
pause();

function pausePlay(){
  if(isActive.value){
    pause();
  } else {
    cIndex.value++;
    resume();
  }
}

function forwardRound(){
      cIndex.value++;
			if (cIndex.value > report.k.rC) {
				cIndex.value = report.k.rC;
			}
			updateStats();

}

</script>

<style scoped>

</style>
