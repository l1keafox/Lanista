<template>
    <div>
        <!--Background-->
        <div class="opacity-25 fixed inset-0 bg-black z-40"></div>
      
        <div class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex" data-id="bg"  v-on:click="bgClose($event)" >
          <div class="relative w-auto my-6 mx-auto max-w-6xl ">
            <!--content-->
            <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none max-h-96">
              <!--header-->
              <div class="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                <h3 v-if="tournamentData" class="text-3xl font-semibold">
                  {{this.tournamentData.type}} Tournament
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
              <!--body-->
              <div class="relative p-6 flex-auto overflow-y-auto bg-yellow-200">
                <div>
                  <div v-for="(fight, index) in this.tournamentData.tournamentStructure[ openTab ]" :key="index" >
                    <div class ="flex justify-between">
                      <div>{{ fight[1]  }} vs  {{ fight[2]  }} </div>
                      <button @click="showDuel(fight.saveId,fight[1],fight[2])" > Duel </button>
                    </div>
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
        <div v-if="isModalShown">
          <!-- <CombatReview/> -->
           <CombatReview
            :combatReport="combatReport"
            @closeModal="closeModal"
            :glads="glads" /> 
        </div>
    
      </div>

</template>

<script>
import CombatReview from '@/components/CombatReview.vue';
    export default {
        name:"singleElimination",
        components:{
          CombatReview,
        },
        props:['tournamentData'],
        async mounted(){
          console.log(this.tournamentData.type);
          console.log(this.tournamentData.winner);
          const roundOne = this.tournamentData.tournamentStructure[0]
          const roundTwo = this.tournamentData.tournamentStructure[1]
          const roundThree = this.tournamentData.tournamentStructure[2]
          const roundFour = this.tournamentData.tournamentStructure[3]
          console.log(roundOne.length);
          console.log(roundTwo.length);
          console.log(roundThree.length); // Ah this is 1 because there was an die before.
          if(roundFour){
            console.log(roundFour.length);
          }

        },
        data(){
          return{
            combatReport:null,
            glads:null,
            isModalShown:false,
            openTab: 0,
          }
        },
        methods:{
          closeModal(){
            this.isModalShown = false;
          },
          async showDuel(duelId,one,two){
            //this.tournamentData.tournamentStructure[ openTab ]
            this.glads = [one,two];
            const rpnse = await fetch(
                `http://${window.location.hostname}:3001/gladiator/getDuel/${duelId}`,
                {headers: { "Content-Type": "application/json" }}
              );
            let rn = await rpnse.json();
            let rpns = await JSON.parse (rn[0].duel);
            this.combatReport = rpns;
           this.isModalShown = true;
          } ,       
          toggleTabs: function(tabNumber){
            this.openTab = tabNumber
          },      
            bgClose(event) {
                if (event.target.getAttribute("data-id") === "bg") {
                    this.$emit('closeModal')
                }
            },

        },
    }
</script>

<style scoped>

</style>