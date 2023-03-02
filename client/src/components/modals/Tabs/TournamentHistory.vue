<template>
	<div>
		<div
			class="relative p-6 flex-auto overflow-y-auto bg-yellow-200 flex flex-col h-[10rem]">
			<div
				v-for="(tournament, index) in tournamentArray"
				:key="index"
				class="flex w-52 justify-between">
				<h1>{{ tournament.tournament.type }}</h1>
				<button
					@click="showDetailModal($event)"
					:data-type="tournament.tournament.type"
					:data-index="index">
					Show Info
				</button>
			</div>

			<div id="intersection"></div>
		</div>

		<BaseFooter>
			<button
				class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
				type="button"
				v-on:click="$emit('closeModal')">
				Close
			</button>
		</BaseFooter>
		<div v-if="isModalShown">
			<component
				:is="components[tournamentType]"
				@closeModal="isModalShown = !isModalShown"
				:tournamentData="tournamentData">
			</component>
		</div>
	</div>
</template>

<script setup>
import BaseFooter from "../BaseFooter.vue";
import roundRobin from "../RoundRobin.vue";
import singleElimination from "../SingleElimination.vue";
import bestOfThree from "../BestOfThreeModal.vue";
import roundRobinBestOfThree from "../RoundRobinOfThree.vue";
import { onMounted, defineProps, inject, ref, defineEmits } from "vue";

const components = {
  roundRobin,
  singleElimination,
  bestOfThree,
  roundRobinBestOfThree
}

const { gladId } = defineProps({
	gladId: {},
});
const apiCall = inject("apiCall");
const isModalShown = ref(false);

const count = ref(0);
const tournamentType = ref(null);
const tournamentData = ref(null);
const tournamentArray = ref(null);

onMounted(() => {
	let observer = new IntersectionObserver(() => {
		loadMorePosts();
	});
	observer.observe(document.getElementById("intersection"));
});

function closeModal() {
	isModalShown.value = false;
}

function showDetailModal(event) {
	const tournKey = {
		"weekly": "roundRobin",
		"monthly": "singleElimination",
		"quarter": "bestOfThree",
		"quater": "bestOfThree",
		"year": "roundRobinBestOfThree",
		"yearly": "roundRobinBestOfThree",
	};

	tournamentType.value = tournKey[event.target.getAttribute("data-type")];
	tournamentData.value =
		tournamentArray.value[event.target.getAttribute("data-index")].tournament;
	isModalShown.value = true;
}

async function loadMorePosts() {
	const addPosts = 10;
	const rpnse = await fetch(
		apiCall.value +
			`/gladiator/someTournaments/${gladId}/${count.value}/${addPosts}`,
		{ headers: { "Content-Type": "application/json" } }
	);
	let rn = await rpnse.json();
	count.value += addPosts;
	rn.forEach((tourn) => {
		tourn.tournament = JSON.parse(tourn.tournament);
	});
  if(!tournamentArray.value){
    tournamentArray.value = rn;
  } else {
    tournamentArray.value.push(...rn);
  }
}
</script>

<style scoped></style>
