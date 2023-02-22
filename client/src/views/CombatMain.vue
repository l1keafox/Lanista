<template>
	<div class="flex flex-col w-full overflow-x-hidden">
		<h2>Pick gladiator</h2>
		<div v-if="ownerData" class="flex">
			<select
				name="gladiator"
				class="bg-cyan-100 w-28 text-purple-800 p-2 m-2"
				id="gladiator">
				<option value="empty">Select</option>
				<template
					v-for="(gladiator, index) in ownerData.gladiators"
					:key="index">
					<option :value="gladiator.name">{{ gladiator.name }}</option>
				</template>
			</select>
			vs
			<select
				name="gladiator2"
				class="bg-cyan-100 w-28 text-purple-800 p-2 m-2"
				id="gladiator2">
				<option value="empty">Select</option>
				<template
					v-for="(gladiator, index) in ownerData.gladiators"
					:key="index">
					<option :value="gladiator.name">{{ gladiator.name }}</option>
				</template>
			</select>

			<button
				class="bg-yellow-200 text-emerald-800 w-48 p-2 m-2"
				@click="doSpar">
				Spar
			</button>
		</div>

		<hr />
		<h2>Fight against a Memory</h2>
		<div v-if="ownerData" class="flex">
			<select
				name="gladiator"
				class="bg-cyan-100 w-28 text-purple-800 p-2 m-2"
				id="memoryGlad">
				<option value="empty">Select</option>
				<template
					v-for="(gladiator, index) in ownerData.gladiators"
					:key="index">
					<option :value="gladiator.name">{{ gladiator.name }}</option>
				</template>
			</select>

			<button
				class="bg-yellow-200 text-emerald-800 w-48 p-2 m-2"
				@click="doMemory">
				Fight Memory
			</button>
		</div>
		
		<div v-if="isModalShown">
			<CombatReview
				:combatReport="combatReport"
				@closeModal="closeModal"
				:glads="glads" />
		</div>
	</div>
</template>

<script>
import CombatReview from "./../components/modals/CombatReview.vue";
import auth from "./../mixins/auth";
export default {
	name: "CombatMain",
	components: {
		CombatReview,
	},
	data() {
		return {
			ownerData: null,
			isModalShown: false,
			combatReport: null,
			history: null,
			glads: [],
			userData: auth.getUser(),
		};
	},
	computed: {},
	inject: ["card", "cardTitle",'getOwner','apiCall'],
	methods: {
		closeModal() {
			this.isModalShown = false;
		},
		async doMemory(){
			let sch = document.getElementById("memoryGlad");
			let gladData = this.ownerData.gladiators.find(
				(glad) => glad.name == sch.value
			);
//			console.log("Doing memory fight",gladData,sch.value);
			if(gladData){
				const rpnse = await fetch(
					this.apiCall.value +				`/gladiator/fightMemory`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							"gladatorId": gladData._id,
							"ownerId": this.userData._id,
						}),
					}
				);
				let rpns = await rpnse.json();
					
				// this.glads = rpns.fighters;
				console.log(rpns);
				// this.glads = rpns.fighters;		
				// this.combatReport = rpns;
				// this.isModalShown = true;				
			}
		},	
		async doSpar() {
			let sch = document.getElementById("gladiator");
			let sch2 = document.getElementById("gladiator2");
			let gladData = this.ownerData.gladiators.find(
				(glad) => glad.name == sch.value
			);
			let glad2 = this.ownerData.gladiators.find(
				(glad) => glad.name == sch2.value
			);
			if (gladData && glad2) {
				const rpnse = await fetch(
					this.apiCall.value +
					`/gladiator/doSpar`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							"gladatorId2": glad2._id,
							"gladatorId": gladData._id,
							"ownerId": this.userData._id,
						}),
					}
				);
				let rpns = await rpnse.json();
				//console.log(rpns);
				//this.glads = [gladData.name, glad2.name];
				this.glads = rpns.fighters;				
//				console.log(this.glads);
				this.combatReport = rpns;
				this.isModalShown = true;
			}
		},
	},

	async mounted() {
		try {
			this.ownerData = this.getOwner;

		} catch (err) {
			console.log(err);
		}
	},
};
</script>

<style scoped></style>
