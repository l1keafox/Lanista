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
					</div>
					<!--body-->
					<div>
						<div>
							{{ this.combatIndex }}
						</div>
						<div class = "flex">
							<div :class="card">
								<h1  :class="cardTitle">{{ glads[0].name }}</h1>
                                <hr/>
                                <template v-if="firstGlad">
                                    <h2>Hp:{{firstGlad.hits}} </h2>
                                    <h2>Morale:{{firstGlad.morale}} </h2>
                                </template>
                                <hr/>

                                Action: {{ combatReport[combatIndex][glads[0].name].clash.clashAbility }}
                                <template v-for="(eff,key) in combatReport[combatIndex][glads[0].name].effect" :key="key">
                                    <h2>{{ key }}:{{ eff }} </h2>
                                </template>
                            </div>
							<div :class="card">

								{{ combatReport[combatIndex].clashResult.winner }}

							</div>
							<div :class="card">
								<h1  :class="cardTitle">{{ glads[1].name }}</h1>
                                <hr/>
                                <template v-if="secondGlad">
                                    <h2>Hp:{{secondGlad.hits}} </h2>
                                    <h2>Morale:{{secondGlad.morale}} </h2>
                                </template>
                                <hr/>

								Action: {{ combatReport[combatIndex][glads[1].name].clash.clashAbility }}
                                <template v-for="(eff,key) in combatReport[combatIndex][glads[1].name].effect" :key="key">
                                    <h2>{{ key }}:{{ eff }} </h2>
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
							@click="backone">
							$lt
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
							v-on:click="$emit('closeModal')">
							Quick finish
						</button>

						<button
							class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
							type="button"
							@click="closeThis">
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
    inject: ['card','cardTitle'],
	data() {
		return {
			combatIndex: 1,
			firstGlad: null,
			secondGlad: null,
			interval: null,
			//combatReport:null
		};
	},
	methods: {
        backone(){
            this.combatIndex--;
            if(this.combatIndex < 1) this.combatIndex = 1;
            this.updateStats();
        },
        forwardOne(){
            this.combatIndex++;
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
        updateStats(){
            if(this.combatReport[this.combatIndex][this.glads[0].name].effect.hits){
                this.firstGlad.hits = this.combatReport[this.combatIndex][this.glads[0].name].effect.hits;
             }
             if(this.combatReport[this.combatIndex][this.glads[0].name].effect.morale){
                this.firstGlad.morale = this.combatReport[this.combatIndex][this.glads[0].name].effect.morale;
             }

             if(this.combatReport[this.combatIndex][this.glads[1].name].effect.hits){
                this.secondGlad.hits = this.combatReport[this.combatIndex][this.glads[1].name].effect.hits;
             }
             if(this.combatReport[this.combatIndex][this.glads[1].name].effect.morale){
                this.secondGlad.morale = this.combatReport[this.combatIndex][this.glads[1].name].effect.morale;
             }

        }
	},
	mounted() {
	//	console.log("REPORT?", this.glads);
		// this.glads  holds the array of glads fought at least there names.
        this.firstGlad = {
            hits: this.glads[0].hits,
            morale: this.glads[0].morale
        };
        this.secondGlad = {
            hits: this.glads[1].hits,
            morale: this.glads[1].morale
        };
		console.log(this.combatReport);
// 		console.log(
// 			this.combatIndex,
// 			this.glads,
// //			this.combatReport[this.combatIndex]
// 		);
		this.interval = setInterval(() => {
			this.combatIndex++;
            this.updateStats();
            if( !this.combatReport[this.combatIndex+1] ){
                clearInterval(this.interval);
                console.log('REPORT WINNER');
            }
		}, 10000);
	},
};
</script>

<style scoped></style>
