<template>
	<div>
		<!--Background-->
		<div class="opacity-25 fixed inset-0 bg-black z-40"></div>

		<div
			class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
			data-id="bg"
			v-on:click="bgClose($event)">
			<div class="relative w-auto my-6 mx-auto max-w-6xl text-black">
				<!--content-->
				<div
					class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
					<!--header-->
					<div
						class="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
						<h3 class="text-3xl font-semibold">Clash Setup</h3>
					</div>
					<!--body-->
					<div v-if="skills" class="relative p-6 flex-auto flex">
						<div>
							<h1>Prepare</h1>
							<draggable
								class="list-group w-64 bg-yellow-100 h-48 m-2"
								:list="prepare"
								sort="false"
								group="prepare"
								itemKey="name">
								<template #item="{ element }">
									<div class="list-group-item m-2 bg-pink-300">{{ element }} </div>
								</template>
							</draggable>
						</div>

						<div>
							<h1>Clash</h1>
							<div class="w-64 bg-yellow-100 h-48 m-2 cursor-auto">
								<template v-for="skill in clash" :key="skill">
									<h1 class="m-2 bg-pink-300"> {{ skill }}</h1>
								</template>
							</div>
						</div>

						<div>
							<h1>Prepare</h1>

							<draggable
								class="list-group w-64 bg-yellow-100 h-48 m-2"
								:list="react"
								sort="false"
								group="react"
								itemKey="name">
								<template #item="{ element }">
									<div class="list-group-item m-2 bg-pink-300">{{ element }} </div>
								</template>
							</draggable>
						</div>
					</div>

					<div v-if="skills" class="relative p-6 flex-auto flex">
						<div>
							<h1>Unassigned Prepare</h1>
							<draggable
								class="list-group w-64 bg-blue-100 h-48 m-2"
								:list="unPrepare"
								sort="false"
								group="prepare"
								itemKey="name">
								<template #item="{ element }">
									<div class="list-group-item m-2 bg-cyan-300">
										{{ element }}
									</div>
								</template>
							</draggable>
						</div>
						<div class="list-group w-64 h-48 m-2"></div>
						<div>
							<h1>Unassigned React</h1>
							<draggable
								class="list-group w-64 bg-blue-100 h-48 m-2"
								:list="unReact"
								sort="false"
								group="react"

								itemKey="name">
								<template #item="{ element }">
									<div class="list-group-item m-2 bg-cyan-300">{{ element }} </div>
								</template>
							</draggable>
						</div>
					</div>
					<!--footer-->
					<div
						class="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
						<button
							class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
							type="button"
							v-on:click="saveClash">
							Save
						</button>

						<button
							class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
							type="button"
							v-on:click="$emit('closeModal')">
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import draggable from "vuedraggable";
export default {
	name: "ClashSetting",
	props: ["gladId"],
	components: {
		draggable,
	},

	data() {
		return {
			skills: null,
			unReact: null,
			unPrepare: null,
			clash: null,
			prepare: null,
			react: null,
		};
	},
	methods: {
    async saveClash(){
      const clashObj = {
        react: this.react,
        prepare: this.prepare
      }
//      console.log(clashObj);
      await fetch(
        `http://${window.location.hostname}:3001/gladiator/updateClash`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "id": this.gladId, "save":clashObj }),
          }
        );
      this.$emit("closeModal");
    },
		bgClose(event) {
			if (event.target.getAttribute("data-id") === "bg") {
				this.$emit("closeModal");
			}
		},
	},
	async mounted() {
		const rpnse = await fetch(
			`http://${window.location.hostname}:3001/gladiator/clashInfo`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ "id": this.gladId }),
			}
		);

		const gladData = await rpnse.json();
		this.skills = gladData;
		this.unPrepare = gladData.unPrepare;
		this.unReact = gladData.unReact;
		this.clash = gladData.clash;
		this.prepare = gladData.prepare;
		this.react = gladData.react;
		//console.log(gladData);
	},
};
</script>

<style scoped></style>
