<template>
	<div class="flex flex-col w-full overflow-x-hidden">
		<div class="bg-slate-900">Potential Students</div>

            <div v-if="showStudent" :class="gladiatorCard">
                <h1> {{showStudent.name}} </h1>
            </div>

		<button @click="getNewGlad">Find New Gladiator</button>
		<button @click="buyNewGlad">Buy New Gladiator</button>
	</div>
</template>

<script>
export default {
	name: "studentMain",
    inject:["gladiatorCard","getOwner"],
	data() {
		return {
            showStudent:null,
            ownerData:null
        };
	},
	mounted() {
        this.ownerData = this.getOwner;
		this.getNewGladiator();
	},
	methods: {
		async getNewGlad() {
			this.getNewGladiator();
		},
        async buyNewGlad(){
            console.log(this.ownerData.id);
            const rpnse = await fetch(
			`http://${window.location.hostname}:3001/owner/buyStudent`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ "gladName": this.showStudent.name, "ownerId": this.ownerData.id }),
			}
            );
            const newGlad = await rpnse.json();
            console.log(newGlad);
        },
		async getNewGladiator() {
			const rpnse = await fetch(
				`http://${window.location.hostname}:3001/owner/getStudent/${this.ownerData.id}`,
				{
					headers: { "Content-Type": "application/json" },
				}
			);
			const newGlad = await rpnse.json();
			console.log(newGlad);
            this.showStudent = newGlad
		},
	},
};
</script>

<style scoped></style>
