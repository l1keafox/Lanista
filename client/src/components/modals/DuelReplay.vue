<template>
  <BaseModal class="w-[800px]">
    <template v-slot:header >
      <div class="text-xl text-black flex justify-between items-center w-full">
        <h1> {{ gladOne.name }}  vs {{gladTwo.name}}</h1>
        <div v-if="winner">  Winner: {{ winner }} </div>
      </div>
    </template>

    <template v-slot:content>
      <div class="flex justify-around">
        <DuelSide :glad="gladOne" :roundInfo="report[cIndex][1]"/>
        <div class="w-[300px] flex flex-col justify-center items-center text-black">
            {{ report[cIndex].R.r }}:
            {{ report[cIndex].R.w == 1 ? gladOne.name + "<" :   report[cIndex].R.w == 2 ? gladTwo.name + ">" : "" }}
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
        cIndex = 1;
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
import { defineProps,reactive,inject,ref } from "vue";

const props = defineProps({
  report: Object,
  duelId: String
})
const btnDecor = "text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"

let report = props.report;
const cIndex = ref(1);

async function blah(duelId){
  const apiCall = inject("apiCall");
	const rpnse = await fetch(
		apiCall.value + `/gladiator/getDuel/${duelId}`,
		{ headers: { "Content-Type": "application/json" } }
	);
  let rpns = await rpnse.json();
  return JSON.parse(rpns[0].duel);

}

if (props.duelId) {
  report = await blah(props.duelId)
  console.log(report);
}


const winner = ref("")

console.log("Duel Report :",report);

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
    winner.value = gladTwo.name
  }
  if(gladTwo.hits <= 0 || gladTwo.morale <= 0  || gladTwo.stamina <= 0  ){
    winner.value = gladOne.name
  }
}
const gladOne = reactive(doStart(report.k[1],1));
const gladTwo = reactive(doStart(report.k[2],2));
updateStats();

function backRound(){
			cIndex.value--;
			if (cIndex.value < 1) cIndex.value = 1;
			updateStats();
}

const { pause, resume, isActive } = useIntervalFn(() => {
  forwardRound();
}, 2000)

function pausePlay(){
  if(isActive.value){
    pause();
  } else {
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
