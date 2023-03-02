<template>
  <BaseModal noFooter="true">
    <template v-slot:header>
      <h1 v-if="item"> {{item.type}} </h1>
    </template>

    <template v-slot:content>
      <div v-if="item" class="p-4"> 
        <h2> SLOT : {{ item.slot }}</h2>
        <h1> Abilities: </h1>
        <div v-for="abi in item.abilities" class="flex flex-col "> 
          <MouseOver :toolTip="toolTipMsg">
            <h3 class="bg-yellow-200 text-center">{{ abi }}</h3>
          </MouseOver>
        </div>
          <!-- {{ item }} -->
      </div>
    </template>

    <template v-slot:footer>
    </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from "./BaseModal.vue"
import MouseOver from "../MouseOver.vue";
import { defineProps,reactive,inject,ref } from "vue";

const apiCall = inject('apiCall')
const toolTipMsg = ref();
const {item} = defineProps({
  item: Object
})

async function getInfo(skill){
  if(skill){
	const rpnse = await fetch(
			apiCall.value + `/owner/ability/${skill}`,
			{
				headers: { "Content-Type": "application/json" },
			}
		);
	let rpns = await rpnse.json();

	toolTipMsg.value = `
	<p>${rpns.type}:</p>
	`

	for(let effName in rpns.effect){
		toolTipMsg.value+= effName+":{"
		for(let stat in rpns.effect[effName]){
			toolTipMsg.value+=stat+":"+rpns.effect[effName][stat]+"/"
		}
		
		toolTipMsg.value += "}    "

	}
	return toolTipMsg
}
}

console.log(item);
</script>

<style scoped>

</style>
