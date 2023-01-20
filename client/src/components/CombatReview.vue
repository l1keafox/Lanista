<template>
	<div>
		<!--Background-->
		<div class="opacity-25 fixed inset-0 bg-black z-40"></div>

		<div
			class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
			data-id="bg"
			v-on:click="bgClose($event)">
			<div class="relative w-auto my-6 mx-auto max-w-6xl">
				<!--content-->
				<div
					class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
					<!--header-->
					<div
						class="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
						<h3 class="text-3xl font-semibold">Combat Result</h3>
						<h3  class="text-3xl font-semibold" v-if="winner"> Winner:{{ winner }} </h3>
					</div>
					<!--body-->
					<div>
						<div>ROUND: {{ this.combatIndex }}</div>
						<div class="flex">
							<div :class="card">
								<h1 :class="cardTitle">{{ glads[0] }}</h1>
								<hr />
								<h1 class="text-red-300 text-xl">
								Action:
								{{
									combatReport[combatIndex][glads[0]].clash.clashAbility
								}}	
								</h1>							
								<hr />
								<template v-if="firstGlad">
									<h2>Hp:{{ firstGlad.hits }}</h2>
									<h2>Morale:{{ firstGlad.morale }}</h2>
									<h2>Stamina:{{ firstGlad.stamina }}</h2>
								</template>
								<hr />
								<h2>winPoints :{{ combatReport[combatIndex][glads[0]].clash.winPoints }}</h2>
								<template
									v-for="(eff, key) in combatReport[combatIndex][glads[0]]
										.clash.effect"
									:key="key">
									<h2 v-if="key !=='clashAbility' ">{{ key }}:{{ eff }}</h2>
								</template>
								<!-- <template v-if=" combatReport[combatIndex][glads[0]].react"> 
										<hr/>
										<h1 class="text-red-300 text-xl"> {{ combatReport[combatIndex][glads[0]].react.name }} </h1>
										<p>  {{ combatReport[combatIndex][glads[0]].react.effect }} </p>
									</template> -->
							</div>
							<div :class="card">
								{{ combatReport[combatIndex].clashResult.winner }}
							</div>
							<div :class="card">
								<h1 :class="cardTitle">{{ glads[1] }}</h1>
								<hr />
								<h1 class="text-red-300 text-xl">
								Action:
								{{
									combatReport[combatIndex][glads[1]].clash.clashAbility
								}}	
								</h1>							
								<hr />
								<template v-if="secondGlad">
									<h2>Hp:{{ secondGlad.hits }}</h2>
									<h2>Morale:{{ secondGlad.morale }}</h2>
									<h2>Stamina:{{ secondGlad.stamina }}</h2>
								</template>
								<hr />
								<h2>winPoints :{{ combatReport[combatIndex][glads[1]].clash.winPoints }}</h2>
								<template
									v-for="(eff, key) in combatReport[combatIndex][glads[1]]
										.clash.effect"
									:key="key">
									<h2 v-if="key !=='clashAbility' ">{{ key }}:{{ eff }}</h2>
								</template>
							</div>
						</div>
					</div>

					<!--footer-->
					<div
						class="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
						<button
							class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
							type="button"
							v-on:click="
								this.combatIndex = 1;
								updateStats();
							">
							Restart
						</button>

						<button
							class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
							type="button"
							@click="backone">
							&lt;&lt;
						</button>
						<button
							class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
							type="button"
							@click="forwardOne">
							>>
						</button>

						<button
							class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
							type="button"
							v-on:click="
								this.combatIndex = this.combatReport.maxRound;
								updateStats();
							">
							End
						</button>

						<button
							class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
							type="button"
							@click="							closeThis							">
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "combatReview",
	props: ["combatReport", "glads"],
	inject: ["card", "cardTitle"],
	data() {
		return {
			combatIndex: 1,
			firstGlad: null,
			secondGlad: null,
			interval: null,
			winner: null,
			//combatReport:null
		};
	},
	methods: {
		backone() {
			this.combatIndex--;
			if (this.combatIndex < 1) this.combatIndex = 1;
			this.updateStats();
		},
		forwardOne() {
			this.combatIndex++;
			if (this.combatIndex > this.combatReport.maxRound) {
				this.combatIndex = this.combatReport.maxRound;
			}
			this.updateStats();
		},
		bgClose(event) {
			if (event.target.getAttribute("data-id") === "bg") {
				this.closeThis();
			}
		},
		closeThis() {
			clearInterval(this.interval);
			this.$emit("closeModal");
		},
		updateStats() {
			if (this.combatReport[this.combatIndex][this.glads[0]].effect.hits) {
				this.firstGlad.hits = this.combatReport[this.combatIndex][this.glads[0]].effect.hits;
			}
			if (this.combatReport[this.combatIndex][this.glads[0]].effect.morale) {
				this.firstGlad.morale = this.combatReport[this.combatIndex][this.glads[0]].effect.morale;
			}
			if (this.combatReport[this.combatIndex][this.glads[0]].effect.stamina) {
				this.firstGlad.stamina = this.combatReport[this.combatIndex][this.glads[0]].effect.stamina;
			}

			if (this.combatReport[this.combatIndex][this.glads[1]].effect.hits) {
				this.secondGlad.hits = this.combatReport[this.combatIndex][this.glads[1]].effect.hits;
			}
			if (this.combatReport[this.combatIndex][this.glads[1]].effect.morale) {
				this.secondGlad.morale = this.combatReport[this.combatIndex][this.glads[1]].effect.morale;
			}
			if (this.combatReport[this.combatIndex][this.glads[1]].effect.stamina) {
				this.secondGlad.stamina = this.combatReport[this.combatIndex][this.glads[1]].effect.stamina;
			}
			if (!this.firstGlad.hits || !this.firstGlad.morale || !this.firstGlad.stamina) {
				this.winner =  this.secondGlad.name;
			}
			if (!this.secondGlad.hits || this.secondGlad.morale < 0 || !this.secondGlad.stamina) {
				this.winner = this.firstGlad.name;
			}
		},
	},
	mounted() {
		//	console.log("REPORT?", this.glads);
		// this.glads  holds the array of glads fought at least there names.
		this.firstGlad = {
			hits: 100, //this.glads[0].hits,
			morale: 100, // this.glads[0].morale,
			stamina: 100,
			name: this.glads[0],
		};
		this.secondGlad = {
			hits: 100,// this.glads[1].hits,
			morale: 100,//this.glads[1].morale,
			stamina: 100,
			name: this.glads[1],
		};
		console.log(this.combatReport);
		this.interval = setInterval(() => {
			this.combatIndex++;
			if (this.combatIndex > this.combatReport.maxRound) {
				this.combatIndex = this.combatReport.maxRound;
			}
			this.updateStats();
			if (this.combatIndex > this.combatReport.maxRound) {
				clearInterval(this.interval);
				console.log("REPORT WINNER");
			}
		}, 10000);
	},
};
</script>

<style scoped></style>
