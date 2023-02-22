<template>
  <BaseModal class="w-[800px]">
    <template v-slot:header>
      <h1> {{ gladOne.name }}  vs {{gladTwo.name}}</h1>
    </template>

    <template v-slot:content>

    </template>

    <template v-slot:footer>

    </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from "./BaseModal.vue"
import { defineProps,reactive,inject } from "vue";
const props = defineProps({
  report: Object,
  duelId: String
})

let report = props.report;

async function getDuel(id){
const apiCall = inject("apiCall");
	const rpnse = await fetch(
		apiCall.value + `/gladiator/getDuel/${id}`,
		{ headers: { "Content-Type": "application/json" } }
	);
  let rpns = await rpnse.json();
  console.log(' DUEL REPORT grabbing off of duelId',report);
  return rpns;
}

if (props.duelId) {
  report = getDuel(props.duelId)
}


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

const gladOne = reactive(doStart(report.k[1],1));
const gladTwo = reactive(doStart(report.k[2],2));

console.log(gladOne);
console.log(gladTwo);

</script>

<style scoped>

</style>
