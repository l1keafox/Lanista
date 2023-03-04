<template>
  <div class="bg-cyan-200 select-none cursor-help" @mouseover="showCardTip(itemId,type)" @mouseleave="hideToolTip()">
    <slot/>
  </div>
</template>

<script setup>

const hideToolTip = inject('hideToolTip')
const showCardTip = inject('showCardTip')
const props = defineProps(['itemId','type'])
const {itemId,type} = toRefs(props)

async function getInfo(skill){
	toolTipMsg.value = skill;
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
	
}

</script>

<style scoped>

</style>