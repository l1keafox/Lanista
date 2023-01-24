<template>
	<div class="flex w-full overflow-x-hidden"></div>
</template>

<script>
export default {
    name:"TournamentMain",
    data(){
        return{
            userData:null
        }
    },
    inject:['getUser'],
    async mounted(){
        this.userData = this.getUser;
        console.log(this.userData);
        const inventory = await fetch(
            `http://${window.location.hostname}:3001/owner/tournament`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "id": this.userData._id}),
            }
            );
            console.log(inventory);
            //this.inventory = await inventory.json();

    }
}
</script>

<style scoped></style>
