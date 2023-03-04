<template>
	<div class="flex flex-wrap">
		<div v-if="glad" :class="gladiatorCard" class="relative items-center m-2 border border-yellow-100">
			<h1 :class="cardTitle">{{ glad.name }}</h1>

			<h2>Level:{{ glad.level }} / Age:{{ glad.age }}</h2>
			<h2>Record : W:{{ glad.winRecord }} / L:{{ glad.lossRecord }}</h2>
			<h2>Local: {{ glad.weekWin }} / Regional : {{ glad.monthWin }}</h2>
			<h2>Quarter : {{ glad.quarterWin }} / National: {{ glad.yearWin }}</h2>
			<hr />
     
      <div class="flex flex-wrap justify-center">
			<button
				:id="'detailsBtn' + index"
				class="bg-blue-200 hover:bg-blue-300 m-1 mx-2 text-purple-700 w-2/5"
				@click="openModal($event, 'GladiatorDetails')"
				:data-id="glad._id">
				Details
			</button>
			<button
				:id="'scheduleBtn' + index"
				class="bg-yellow-200 hover:bg-yellow-300 m-1 mx-2 text-purple-900  w-2/5"
				@click="openModal($event, 'ScheduleManager')"
				:data-id="glad._id">
				Schedule
			</button>
			<button
				:id="'historyBtn' + index"
				class="bg-purple-200 hover:bg-purple-300 m-1 mx-2 text-purple-700  w-2/5"
				@click="openModal($event, 'HistoryModal')"
				:data-id="glad._id">
				History
			</button>
			<button
				:id="'historyBtn' + index"
				class="bg-red-200 hover:bg-red-300 m-1 mx-2 text-purple-700  w-2/5"
				@click="openModal($event, 'GladiatorOptions')"
				:data-id="glad._id">
				Options
			</button>
    </div>
			<div class=" absolute bottom-10 items-center flex justify-center">
				<Character
					class="h-[10rem] w-[10rem]"
					:clothes="makeClothes(glad)"
					:animation="jobToAnimate"
					:direction="jobDirection"
					:gladName="glad.name" />
			</div>
			<span class="absolute right-36 bottom-4" v-if="training">
				{{ training[0] }}
			</span>
			<span class="absolute right-10 bottom-24" v-if="training" id="growth">
				{{ training[growthIndex] }}
			</span>
		</div>
	</div>
</template>

<script setup>
import { useIntervalFn } from "@vueuse/core";

const { glad, index } = defineProps(["glad", "index"]);
const emit = defineEmits("openBigModal");

const training = ref(null);
const growthIndex = ref(1);
const isModalShown = ref(null);
const jobToAnimate = ref("stand");
const jobDirection = ref("down");

watch(training, () => {
	jobToAnimate.value = getAnimate();
	jobDirection.value = getDirection();
});

const gladiatorCard = inject("gladiatorCard");
const cardTitle = inject("cardTitle");

function getDirection(job) {
	switch (job) {
		default:
			let rando = ["Up", "Down", "Left", "Right"];
			let random = Math.floor(Math.random() * rando.length);
			return rando[random];
	}
}
function getAnimate(job) {
	switch (job) {
		default: //
			let rando = [
				"stand",
				"push",
				"pull",
				"jump",
				"stand",
				"run",
				"walk",
				"chop",
				"throw",
				"water",
				"lift",
				"smith",
				"climbing",
				"surprise",
				"look",
				,
				"hip",
				"toe",
				"chair",
				"chairHead",
				"sit0",
				"sit1",
				"lay",

				"draw",
				"parry",
				"dodge",
				"hurt",
				"dead",
				"idle",
				"move",
				"crouch",
				"retreat",
				"lunge",
				"slash1",
				"slash2",
				"thrust",
				"bash",
			];
			/*

          confirme bookred - ""drink""

          p1 - "stand","push","pull","jump","stand","run","walk"
          p2 - "chop","throw","water","lift"
          p4 - "smith","climbing","surprise","look","drink","hip","toe","chair","chairHead","sit0","sit1","lay"

          pONE1 - "draw","parry","dodge","hurt","dead"
          pONE2 - "idle","move","idle","crouch","retreat","lunge"
          pONE3 - "slash1","slash2","thrust","bash"
          */

			//"chop","throw"
			//"slash1","slash2","bash","thrust","draw","idle",'move','crouch','retreat','lunge','parry','dodge','hurt','dead'
			let random = Math.floor(Math.random() * rando.length);
			return rando[random];
	}
}
function makeClothes(glad) {
	return {
		hair: glad.hairChar,
		style: glad.hairStyleChar,
		skin: glad.skinChar,
		sex: glad.sexChar,
		body: 1,
	};
}
function openModal(event, modalName) {
	emit("openBigModal", {
		gladiatorId: event.target.getAttribute("data-id"),
		modalShown: modalName,
	});
}
function closeModal() {
	isModalShown.value = false;
}

onMounted(() => {
	training.value = glad.lastGain;
	const { pause, resume, isActive } = useIntervalFn(() => {
		growthIndex.value++;
		if (growthIndex.value > 5) {
			growthIndex.value = 1;
		}
		training.value = glad.lastGain;
	}, 1950);
});
</script>

<style scoped>
@keyframes redGlow {
	0% {
		opacity: 0;
	}
	50% {
		opacity: 100;
	}
	100% {
		opacity: 0;
	}
}
#growth {
	animation: redGlow 2.1s infinite;
}
</style>
