<template>
  <BaseModal>
    <template v-slot:header>
      <h3 class="text-3xl font-semibold">Clash Setup</h3>
    </template>

    <template v-slot:content>
      					<div v-if="skills" class="relative p-6 flex-auto flex">
						<div>
							<h1>Prepare</h1>
							<draggable
								class="list-group w-64 bg-yellow-100 h-48 m-2"
								:list="prepare"
								sort="false"
								group="prepare"
								itemKey="name"> -->
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

    </template>

    <template v-slot:footer>
      						<button
							class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
							type="button"
							v-on:click="saveClash">
							Save
						</button>

    </template>
  </BaseModal>
</template>

<script>
import BaseModal from "./BaseModal.vue"

import draggable from "vuedraggable";
export default {
	name: "ClashSetting",
	props: ["gladId"],
	inject:["apiCall"],
	components: {
		draggable,
    BaseModal
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
      await fetch(
				this.apiCall.value + '/gladiator/updateClash',
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "id": this.gladId, "save":clashObj }),
          }
        );
      this.$emit("closeModal");
    },
	},
	async mounted() {
		
		const rpnse = await fetch(
			this.apiCall.value + `/gladiator/clashInfo/${ this.gladId }`,
			{
				headers: { "Content-Type": "application/json" },
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

<style scoped>

</style>