<template>
  <BaseModal>
    <template v-slot:header>
      Tournament History
    </template>

    <template v-slot:content>
      <div class="relative p-6 flex-auto overflow-y-auto bg-yellow-200 flex flex-col">
        <div v-for="(tournament, index) in tournamentArray" :key="index" class="flex w-52 justify-between">
          <h1>{{ tournament.tournament.type }}</h1>
          <button @click="showDetailModal($event)" :data-type="tournament.tournament.type"  :data-index="index"> Show Info</button>
        </div>

        <div id="intersection"> </div>
      </div>

    </template>

    <template v-slot:modal>
      <div v-if="isModalShown">
        <component :is="tournamentType" @closeModal="isModalShown = !isModalShown" :tournamentData="tournamentData"> </component>
      </div>
    </template>
  </BaseModal>
</template>


<script>
import BaseModal from "./BaseModal.vue"
import roundRobin from './RoundRobin.vue'
import singleElimination from './SingleElimination.vue';
import bestOfThree from './BestOfThreeModal.vue';
import roundRobinBestOfThree from './RoundRobinOfThree.vue';

    export default {
        name:"GladiatorTournament",
        props:["gladId"],
        inject:['apiCall'],
        components:{
          roundRobin,
          singleElimination,
          BaseModal,
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
            this.isModalShown = true;
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