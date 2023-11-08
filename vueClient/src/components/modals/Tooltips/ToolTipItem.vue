<template>
  <div v-if="propList">	
    <div v-for="skill in propList" :key="skill" class="border p-1">
      {{ skill.abilityName }} : ABILITY
      <span v-for="(effect,key) in cutEffect(skill.effect )" :key="effect" >
        <p>{{ key }} :	
          <span v-for="(stat,statKey) in effect" :key="statKey">
            {{statKey[0]}}{{statKey[1]}}{{statKey[2]}}{{statKey[3]}} {{ (gladData[statKey] * (stat*0.01)).toFixed(0) }}/
						
          </span>
        </p>
      </span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['propList','gladData'])
const {propList,gladData} = toRefs(props);
function cutEffect( effect ){
	const stats = {
		"strength":1,
		"dexterity":1,
		"agility":1,
		"constitution":1,
		"vitality":1,
		"intelligence":1,
		"wisdom":1,
		"bravery":1,
		"sensitivity":1,
		"charisma":1,
		"luck":1,
		"reputation":1,
	};	
	const rtnObj = {}
	for(let name in effect){
		rtnObj[name] = {};
		for(let key in effect[name]){
			const next = effect[name][key]
			if(stats[key]){
				rtnObj[name][key] = next;
			}
		}
	}
	return rtnObj;
}
</script>

<style scoped>

</style>