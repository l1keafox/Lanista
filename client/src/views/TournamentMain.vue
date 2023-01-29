<template>
	<div class="flex w-full overflow-x-auto flex-wrap">
        <template v-if="tournaments">
            <div v-for="(tourny,index) in tournaments" :key="index" class="">
                <div :class="largeCard">
                    <h1>{{ tourny.tournament.type }} </h1>
                    <hr/>
                    <button class="bg-yellow-200 m-2 p-3 text-black" @click="showDetailModal($event)" :data-type="tourny.tournament.type" :data-index="index"> Show Details </button>
                    <div  class="overflow-y-auto h-full">
                    <template v-for="(glad,index2) in tourny.gladiators" :key="index2">
                        <template v-if="gladOwned(glad)">
                            <h2 class ="text-red-500">**{{glad.name}}**</h2>
                        </template>
                        <template v-else>
                            <h2>{{glad.name}}</h2>
                        </template>

                    </template>
                    <template v-for="(glad,index) in tourny.memories" :key="index">
                        <template v-if="gladOwned(glad)">
                            <h2 class ="text-red-500">**{{glad.name}}**</h2>
                        </template>
                        <template v-else>
                            <h2>{{glad.name}}</h2>
                        </template>

                    </template>
                    </div>
                </div>
            </div>
            <div id="intersection" class="bg-yellow-100" @click="this.loadMorePosts"> </div>

        </template>
        <div v-if="isModalShown">
            <component :is="tournamentType" :tournamentData="tournamentData" @closeModal="closeModal"> </component>
        </div>
  
    </div>
</template>

<script>
import roundRobin from './../components/roundRobinTournament';
import singleElimination from './../components/singleEliminationTournament';
import bestOfThree from './../components/bestOfThreeTournament';
import roundRobinBestOfThree from './../components/roundRobinOfThreeTournament';

export default {
    name:"TournamentMain",
    components:{
        roundRobin,
        singleElimination,
        bestOfThree,
        roundRobinBestOfThree
    },
    data(){
        return{
            userData:null,
            isModalShown:false,
            tournamentType:null,
            tournamentData:null,
            count:0,
            tournaments:[],
            ownerData:null,
            tournament:null
        }
    },
    inject:['getUser','largeCard','getOwner'],
    methods:{
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
            this.tournamentData = this.tournaments[event.target.getAttribute("data-index")].tournament
            console.log(this.tournaments[event.target.getAttribute("data-index")].tournament, event.target.getAttribute("data-index") )
            this.isModalShown = true;
            
        },
        gladOwned(glad){
            let rsult = this.ownerData.gladiators.findIndex(ownedGlad =>{
                return glad.name  == ownedGlad.name
            })
            return rsult > -1;
        }, 
        closeModal() {
              this.isModalShown = false;
        },
        async  loadMorePosts(){
              const addPosts = 25;
              const rpnse = await fetch(
                `http://${window.location.hostname}:3001/owner/someTournament/${this.userData.ownerId}/${this.count}/${addPosts}`,
                {headers: { "Content-Type": "application/json" }}
              );
              let rn = await rpnse.json();
              this.count += addPosts;
                console.log(rn);
                rn.forEach(tourn => {tourn.tournament = JSON.parse(tourn.tournament);})
              this.tournaments.push(...rn);
            },
    },
    async mounted(){
        this.userData = this.getUser;
        this.ownerData = this.getOwner;
        console.log(this.userData);
        let observer = new IntersectionObserver(this.loadMorePosts);
        observer.observe(document.getElementById("intersection"));
    }
}
</script>

<style scoped></style>
