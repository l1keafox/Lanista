<template>
	<div class="flex w-full overflow-x-hidden">


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
    inject:['getUser'],
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
