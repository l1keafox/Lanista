<template>
	<div class="flex flex-col w-full overflow-x-hidden">
		<div class="bg-slate-900">Potential Students</div>

            <div v-if="showStudent" class="flex">
                <template v-for="(student,index) in showStudent" :key="index">
                <div :class="gladiatorCard">
                    <h1> {{student.name}} </h1>
                    <h1>strength: {{student.strength}} </h1>
                    <h1>dexterity: {{student.dexterity}} </h1>
                    <h1>agility: {{student.agility}} </h1>
                    <h1>constitution: {{student.constitution}} </h1>
                    <h1>vitality: {{student.vitality}} </h1>

                    <h1>bravery: {{student.bravery}} </h1>
                    <h1>charisma: {{student.charisma}} </h1>
                    <h1>reputation: {{student.reputation}} </h1>

                    <h1>intelligence: {{student.intelligence}} </h1>
                    <h1>morale: {{student.morale}} </h1>
                    <h1>piety: {{student.piety}} </h1>
                    <h1>sensitivity: {{student.sensitivity}} </h1>
                    <h1>wisdom: {{student.wisdom}} </h1>

                    <button @click="buyNewGlad($event)" :data-index="index">Buy New Gladiator</button>
                </div>
                </template>

            </div>

		<button @click="getNewGlad">Find New Gladiator</button>
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
        async buyNewGlad(event){
            console.log(this.ownerData.id,event.target.getAttribute("data-index"));
            const index = event.target.getAttribute("data-index");
            const rpnse = await fetch(
			`http://${window.location.hostname}:3001/owner/buyStudent`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ "gladName": this.showStudent.name, "ownerId": this.ownerData.id,index }),
			}
            );
            this.showStudent.splice(index,1);
            await rpnse.json();
            //console.log(newGlad);
        },
		async getNewGladiator() {
			const rpnse = await fetch(
				`http://${window.location.hostname}:3001/owner/getStudent/${this.ownerData.id}`,
				{
					headers: { "Content-Type": "application/json" },
				}
			);
            this.showStudent = await rpnse.json();
		},
	},
};
</script>

<style scoped></style>
