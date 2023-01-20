<template>
	<div class="flex flex-col h-full">
		<h1 class="bg-slate-900">Combat</h1>
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
		
		<div class="flex flex-col">
			<div>Fighting History</div>
		</div>
		<div v-if="ownerData" class="flex"></div>
		<div v-if="isModalShown">
			<CombatReview
				:combatReport="combatReport"
				@closeModal="closeModal"
				:glads="glads" />
		</div>
	</div>
</template>

<script>
import CombatReview from "@/components/CombatReview";
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
	inject: ["card", "cardTitle"],
	methods: {
		closeModal() {
			this.isModalShown = false;
		},
		async doMemory(){
			let sch = document.getElementById("memoryGlad");
			let gladData = this.ownerData.gladiators.find(
				(glad) => glad.name == sch.value
			);
			if(gladData){
				const rpnse = await fetch(
					`http://${window.location.hostname}:3001/gladiator/fightMemory`,
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
				//console.log(rpns);
//				this.glads = [gladData, glad2];
//				console.log(this.glads);
				this.combatReport = rpns;
				this.isModalShown = true;				
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
					`http://${window.location.hostname}:3001/gladiator/doSpar`,
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
				this.glads = [gladData, glad2];
				console.log(this.glads);
				this.combatReport = rpns;
				this.isModalShown = true;
			}
		},
	},

	async mounted() {
		try {
			const rpnse = await fetch(
				`http://${window.location.hostname}:3001/owner`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ "id": this.userData._id }),
				}
			);
//			console.log(rpnse);
			let ownerData = await rpnse.json();
//			console.log(ownerData);
			this.ownerData = ownerData;
			// if (ownerData.history.length > 0) {
			// 	console.log(ownerData.history[0]);
			// 	const history = await fetch(
			// 		`http://${window.location.hostname}:3001/gladiator/getDuelHistory`,
			// 		{
			// 			method: "POST",
			// 			headers: { "Content-Type": "application/json" },
			// 			body: JSON.stringify({ "historyId": ownerData.history[0] }),
			// 		}
			// 	);
			// 	console.log(history);
			// 	let ddtd = await history.json();
			// 	console.log("Wat",ddtd);
			// }
		} catch (err) {
			console.log(err);
		}
	},
};
</script>

<style scoped></style>
