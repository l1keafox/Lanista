<template>
  <div>
    <!--Background-->
    <div class="opacity-25 fixed inset-0 bg-black z-40"></div>
  
    <div class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex" data-id="bg"  v-on:click="bgClose($event)" >
      <div class="relative w-auto my-6 mx-auto max-w-6xl">
        <!--content-->
        <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          <!--header-->
          <div class="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
            <h3 v-if="gladiatorData" class="text-3xl font-semibold">
              {{ gladiatorData.name }}
            </h3>
          </div>
          <!--body-->
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
          <!--footer-->
          <div class="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
            <button class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" v-on:click="$emit('closeModal')">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  </template>
  
  <script>
  export default {
    name: "GladiatorStats",
    props: ["gladId"],
    data() {
      return {
        gladiatorData: null,
      };
    },
    methods:{
      bgClose(event){
            if(event.target.getAttribute("data-id") === "bg"){
              this.$emit('closeModal')
            }
          },

    },
    async mounted() {
      const rpnse = await fetch(
        `http://${window.location.hostname}:3001/gladiator/${this.gladId}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      this.gladiatorData = await rpnse.json();
    },
  };
  </script>
  
  <style scoped>
</style>
  