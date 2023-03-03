<template>
  <BaseModal>
    <template v-slot:header>
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
          <li class="-mb-px mr-2 last:mr-0 flex-auto text-center">
            <a class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal" v-on:click="toggleTabs(4)" v-bind:class="{'text-pink-600 bg-white': openTab !== 4, 'text-white bg-pink-600': openTab === 4}">
              Round Four
            </a>
          </li>
        </ul>
      </div>   

    </template>

    <template v-slot:content>
      <div>
        <div v-for="(fight, index) in this.tournamentData.tournamentStructure[ openTab ]" :key="index" >
          <div class ="flex justify-evenly">
            <h1>{{ fight[0][1] }} vs {{ fight[0][2] }} </h1>
            <template v-for="(duel,index) in fight" :key="index" >
              <div class="bg-green-200 flex">
              <button @click="showDuel(fight.saveId,fight[1],fight[2])" > Duel {{index}}</button>
              </div>
            </template>
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
        name:"bestOfThreeModal",
        props:['tournamentData'],
        inject:['apiCall'],
        async mounted(){
          console.log(this.tournamentData.type);
          console.log(this.tournamentData.winner);
          console.log(this.tournamentData.tournamentStructure);
          // const roundOne = this.tournamentData.tournamentStructure[0]
          // const roundTwo = this.tournamentData.tournamentStructure[1]
          // const roundThree = this.tournamentData.tournamentStructure[2]
          // const roundFour = this.tournamentData.tournamentStructure[3]
          // console.log(roundOne.length);
          // console.log(roundTwo.length);
          // console.log(roundThree.length); // Ah this is 1 because there was an die before.
          // if(roundFour){
          //   console.log(roundFour.length);
          // }
        },
        data(){
          return{
            combatReport:null,
            glads:null,
            isModalShown:false,
            selectedIndex:0,
            openTab: 0,
          }
        },        
        methods:{
          closeModal(){
            this.isModalShown = false;
          },
          toggleTabs: function(tabNumber){
            this.openTab = tabNumber
          },  
          async showDuel(duelId,one,two){
            //this.tournamentData.tournamentStructure[ openTab ]
            this.glads = [one,two];
            const rpnse = await fetch(
              this.apiCall.value + `/gladiator/getDuel/${duelId}`,
                {headers: { "Content-Type": "application/json" }}
              );
            let rn = await rpnse.json();
            let rpns = await JSON.parse (rn[0].duel);
            this.combatReport = rpns;
           this.isModalShown = true;
          } ,       

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