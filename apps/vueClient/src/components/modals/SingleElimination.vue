<template>
  <BaseModal>
    <template v-slot:header>
      <div class="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
        <h3 v-if="tournamentData" class="text-3xl font-semibold">
          Tournament
        </h3>
        <div class="text-sm font-medium text-center text-gray-500  border-gray-200 dark:text-gray-400 dark:border-gray-700">
          <ul class="flex flex-wrap -mb-px">

            <li class="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal" v-on:click="toggleTabs(0)" v-bind:class="{'text-pink-600 bg-white': openTab !== 0, 'text-white bg-pink-600': openTab === 0}">
                Round One
              </a>
            </li>
            <li class="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal" v-on:click="toggleTabs(1)" v-bind:class="{'text-pink-600 bg-white': openTab !== 1, 'text-white bg-pink-600': openTab === 1}">
                Round Two
              </a>
            </li>
            <li class="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal" v-on:click="toggleTabs(2)" v-bind:class="{'text-pink-600 bg-white': openTab !== 2, 'text-white bg-pink-600': openTab === 2}">
                Round Three
              </a>
            </li>
            <li class="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal" v-on:click="toggleTabs(3)" v-bind:class="{'text-pink-600 bg-white': openTab !== 3, 'text-white bg-pink-600': openTab === 3}">
                Round Four
              </a>
            </li>
          </ul>
      </div>                     
      </div>

    </template>

    <template v-slot:content>
      <div class="relative p-6 flex-auto overflow-y-auto bg-yellow-200">
        <div v-if="tournamentData">
          <div v-for="(fight, index) in tournamentData.tournamentStructure[ openTab ]" :key="index" >
            <div class ="flex justify-between">
              <div>{{ fight[1]  }} vs  {{ fight[2]  }} </div>
              <button @click="showDuel(fight.saveId,fight[1],fight[2])" > Duel </button>
            </div>
          </div>
        </div>

       </div>
      </template>

    <template v-slot:modal>
      <div v-if="isModalShown">
        <Suspense>
          <DuelReplay :duelId="duelId" :report="combatReport" @closeModal="isModalShown = !isModalShown"/>
        </Suspense>
      </div>
    </template>
  </BaseModal>

</template>

<script >
    export default {
        name:"singleElimination",
        props:['tournamentData'],
        inject:['apiCall'],
        async mounted(){
          if(this.tournamentData){
            const roundOne = this.tournamentData.tournamentStructure[0]
            const roundTwo = this.tournamentData.tournamentStructure[1]
            const roundThree = this.tournamentData.tournamentStructure[2]
            const roundFour = this.tournamentData.tournamentStructure[3]
          }

        },
        data(){
          return{
            duelId:null,
            glads:null,
            isModalShown:false,
            openTab: 0,
          }
        },
        methods:{
          async showDuel(duelId,one,two){
            this.duelId = duelId;
            this.isModalShown = true;
          } ,       
          toggleTabs: function(tabNumber){
            this.openTab = tabNumber
          },      

        },
    }
</script>

<style scoped>

</style>