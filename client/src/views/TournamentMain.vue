<template>
	<div class="flex w-full overflow-x-hidden"></div>
</template>

<script>
export default {
    name:"TournamentMain",
    inject:['userData'],
    async mounted(){
        console.log(this.userData._id);
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
