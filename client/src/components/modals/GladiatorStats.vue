<template>
  <BaseModal>
    <template v-slot:header>
      <h1 v-if="gladiatorData" class="text-3xl font-semibold">
        {{ gladiatorData.name }}
      </h1>
      <h2 v-if="gladiatorData" class="text-lg font-semibold">
        Id: {{ gladiatorData._id }}
      </h2>

    </template>

    <template v-slot:content>
      <div class="relative p-6 flex-auto">
  
        <div v-if="gladiatorData" class="flex">
          <div class="flex p-2 flex-col h-48 w-48 bg-slate-800">
            <h1> Stat Points </h1>
            <h2>hits:{{gladiatorData.hits}}</h2>
            <h2>stamina:{{gladiatorData.stamina}}</h2>
            <h2>morale:{{gladiatorData.morale}} </h2>
            <h2>mana:{{gladiatorData.mana}} </h2>
          </div>
          <div class="flex p-2 flex-col h-48 w-48 bg-green-800">
            <h1> Record </h1>
            <h2> Age: {{ gladiatorData.age }} </h2>
            <h2> Level: {{ gladiatorData.level }} </h2>
            <h2> Wins: {{ gladiatorData.winRecord }} </h2>
            <h2> Losses: {{ gladiatorData.lossRecord }} </h2>

          </div>

          <div class="flex p-2  flex-col h-48 w-48 bg-blue-800">
            <h1> Physical </h1>
            <h2>strength:{{gladiatorData.strength}}</h2>
            <h2>dexterity:{{gladiatorData.dexterity}}</h2>
            <h2>agility:{{gladiatorData.agility}} </h2>
            <h2>constitution:{{gladiatorData.constitution}}</h2>
            <h2>vitality:{{gladiatorData.vitality}}</h2>
          </div>
          <div class="flex  p-2 flex-col h-48 w-48 bg-red-800">
            <h1> Mental </h1>
            <h2>intelligence:{{gladiatorData.intelligence}} </h2>
            <h2>wisdom:{{gladiatorData.wisdom}}</h2>
            <h2>bravery:{{gladiatorData.bravery}} </h2>
            <h2>piety:{{gladiatorData.piety}}</h2>
           <h2> sensitivity:{{gladiatorData.sensitivity}}</h2>
          </div>
          <div class="flex  p-2 flex-col h-48 w-48 bg-yellow-800">
            <h1> Social </h1>
            <h2>luck:{{gladiatorData.luck}}</h2>
            <h2>reputation:{{gladiatorData.reputation}} </h2>
            <h2>charisma:{{gladiatorData.charisma}}</h2>
          </div>
  
      </div>

</div>

    </template>

    <template v-slot:footer>
      
    </template>
  </BaseModal>
</template>

<script>
  export default {
    name: "GladiatorStats",
    props: ["gladId","gladMemory"],
    components:{
    },
    inject:['apiCall'],
    data() {
      return {
        gladiatorData: null,
      };
    },
    methods:{
    },
    async mounted() {
      if(this.gladId){
          const rpnse = await fetch(
          this.apiCall.value+ `/gladiator/${this.gladId}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        this.gladiatorData = await rpnse.json();
      } else if(this.gladMemory){
        this.gladiatorData = JSON.parse(this.gladMemory.memory);
            // console.log("THIS",this.gladMemory);
            // console.log("PARSED",this.gladiatorData);
            this.gladiatorData.name = this.gladMemory.name;
            this.gladiatorData.age = this.gladMemory.age;
            this.gladiatorData.level = this.gladMemory.level;
            this.gladiatorData.winRecord = this.gladMemory.winRecord;
            this.gladiatorData.lossRecord = this.gladMemory.lossRecord;

      }
    },
  };
  </script>
  

<style scoped>

</style>