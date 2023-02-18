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
                <!-- <h3 v-if="gladiatorData" class="text-3xl font-semibold"> -->
                  RoundRobin
                <!-- </h3> -->
              </div>
              <!--body-->
              <div class="relative p-6 flex-auto overflow-y-auto bg-yellow-200 flex flex-col">
                <div v-for="(tournament, index) in tournamentArray" :key="index" class="flex w-52 justify-between">
                  <h1>{{ tournament.tournament.type }}</h1>
                  <button @click="showDetailModal($event)" :data-type="tournament.tournament.type"  :data-index="index"> Show Info</button>
                </div>

                <div id="intersection"> </div>
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
          <component :is="tournamentType" :tournamentData="tournamentData" @closeModal="closeModal"> </component>
        </div>
    
      </div>

</template>

<script>
import roundRobin from './roundRobinTournament.vue'
import singleElimination from './singleEliminationTournament.vue';
import bestOfThree from './bestOfThreeTournament.vue';
import roundRobinBestOfThree from './roundRobinOfThreeTournament.vue';

    export default {
        name:"GladiatorTournament",
        props:["gladId"],
        inject:['apiCall'],
        components:{
          roundRobin,
          singleElimination,
          bestOfThree,
          roundRobinBestOfThree
        },
        data(){
          return{
            count:0,
            isModalShown:false,
            tournamentType:null,
            tournamentData:null,
            tournamentArray:[],
          }
        },
        
        async mounted(){
          let observer = new IntersectionObserver(()=>{
              this.loadMorePosts();
            });
              observer.observe(document.getElementById("intersection"));
        },
        methods:{
          closeModal() {
              this.isModalShown = false;
        },

          showDetailModal(event){
            const tournKey = {
                "weekly": "roundRobin",
                "monthly": "singleElimination",
                "quarter": "bestOfThree",
                "quater": "bestOfThree",
                "year": "roundRobinBestOfThree",
                "yearly": "roundRobinBestOfThree"
            };

            this.tournamentType = tournKey[event.target.getAttribute("data-type")];
            this.tournamentData = this.tournamentArray[event.target.getAttribute("data-index")].tournament
            console.log(this.tournamentArray[event.target.getAttribute("data-index")].tournament, event.target.getAttribute("data-index") )
            this.isModalShown = true;
        },

            bgClose(event) {
                if (event.target.getAttribute("data-id") === "bg") {
                    this.$emit('closeModal')
                }
            },
            async  loadMorePosts(){
              const addPosts = 10;
              const rpnse = await fetch(
                this.apiCall.value +                 `/gladiator/someTournaments/${this.gladId}/${this.count}/${addPosts}`,
                {headers: { "Content-Type": "application/json" }}
              );
              let rn = await rpnse.json();
              this.count += addPosts;
              rn.forEach(tourn => {tourn.tournament = JSON.parse(tourn.tournament);})
              this.tournamentArray.push(...rn);
            },            

        },
    }
</script>

<style scoped>

</style>