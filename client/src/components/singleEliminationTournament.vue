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
                <div class = "flex">  
                           
              </div>
                <div>
                  {{  this.tournamentData.tournamentStructure[ openTab ] }}
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
        <!-- <div v-if="isModalShown">
           <CombatReview
            :combatReport="combatReport"
            @closeModal="closeModal"
            :glads="glads" /> 
        </div> -->
    
      </div>

</template>

<script>
    export default {
        name:"singleElimination",
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
            selectedIndex:0,
            openTab: 0,
            selectedTab:"inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500",
            notSelectedTab:"inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
          }
        },
        methods:{
          // selectTab (i) {
          //   this.selectedIndex = i
          // // loop over all the tabs
          //   // this.tabs.forEach((tab, index) => {
          //   //   tab.isActive = (index === i)
          //   // })
          // },          
          toggleTabs: function(tabNumber){
      this.openTab = tabNumber
    },          
          // tabButton(round){
          //   // const round = event.target.getAttribute("data-round");
          //   this.selectedIndex = round;
          // },
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