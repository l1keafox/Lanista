<template>
	<div class="flex w-full overflow-x-auto flex-col flex-wrap">
        <template v-if="tournamentData">
            <div v-for="tourny in tournamentData" :key="tourny" class="">
                <div :class="card">
                    <h1>Type: {{ tourny.tournament.type }} </h1>
                    <button> Show Details </button>
                    <button> Show Gladiators </button>
                    <button> Show Owners </button>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    name:"TournamentMain",
    data(){
        return{
            userData:null,
            tournamentData:null
        }
    },
    inject:['getUser','card'],
    async mounted(){
        this.userData = this.getUser;
        console.log(this.userData);
        const inventory = await fetch(
            `http://${window.location.hostname}:3001/owner/allTournament`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "ownerId": this.userData.ownerId}),
            }
            );
            this.tournamentData = await inventory.json();
            this.tournamentData.forEach(tourn => {
                tourn.tournament = JSON.parse(tourn.tournament);
            })
            console.log(this.tournamentData);
            // Each tournament will have one of this guys users
            // So let's first show it as cards then we will have the cards show winner and type
            // then we will 
            // tournament Data will have owners, memories, gladiators and the tournament data.
            //
            //this.inventory = ;

    }
}
</script>

<style scoped></style>
