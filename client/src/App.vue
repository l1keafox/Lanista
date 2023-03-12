<template>
	<div class="flex flex-col h-screen w-screen overflow-hidden z-0 font-dot">
		<Header @logged="update" :tickTimer="toNextTick" />
		<div class="flex h-[calc(100vh-120px)] w-full">
			<SideNav @logged="update" v-model="stageMain" />
			<component :is="components[stageMain]" />
		</div>
	</div>

	<BaseTutorialModal
		v-if="showTutorialModal && isLoggedIn"
		v-model="showTutorialModal"
		:tutorialArray="tutorialArray" />

	<component
		v-if="showToolTipModal"
		:context="toolTipContext"
		:type="contextType"
		:gladData="toolTipGladData"
		:is="modals[toolTipType]" />
</template>

<script setup>
import HowToPlayMain from "./views/HowToPlayMain.vue";
import GladiatorsMain from "./views/GladiatorsMain.vue";
import SchoolMain from "./views/SchoolMain.vue";
import WelcomeMain from "./views/WelcomeMain.vue";
import CombatMain from "./views/CombatMain.vue";
import StoreMain from "./views/StoreMain.vue";
import TournamentMain from "./views/TournamentMain.vue";
import StudentMain from "./views/StudentMain.vue";
import FeedbackMain from "./views/FeedbackMain.vue";
import RankingMain from "./views/RankingMain.vue";
import GamblingMain from "./views/GamblingMain.vue";
import CreditMain from "./views/CreditMain.vue";
import PvpMain from "./views/PvpMain.vue";

import CardToolTipModal from "./components/modals/CardToolTipModal.vue";

import auth from "./composables/auth";
import { useTitle } from "@vueuse/core";

const components = {
	PvpMain,
	WelcomeMain,
	RankingMain,
	CreditMain,
	GamblingMain,
	FeedbackMain,
	HowToPlayMain,
	StudentMain,
	GladiatorsMain,
	CombatMain,
	TournamentMain,
	StoreMain,
	SchoolMain,
};
const modals = {
	CardToolTipModal,
};

let timeTimer;
let countDown;
let interval;
let timerInterval;
const apiData =
	location.protocol === "https:"
		? `https://${window.location.hostname}`
		: `http://${window.location.hostname}:3001`;

const isLoggedIn = ref(auth.loggedIn());
const toolTipType = ref(null);
const showTutorialModal = ref(false);
const showToolTipModal = ref(false);
const toolTipContext = ref(null);
const contextType = ref(null);
const toolTipGladData = ref(null);

const stageMain = ref("WelcomeMain");

const timeData = ref(null);
const toNextTick = ref(0);
const userData = ref(null);
const ownerData = ref(null);
const tutorialArray = ref([]);

provide(
	"card",
	"h-80 w-56 p-3 m-3 cursor-default select-none flex flex-col bg-slate-700 "
);
provide(
	"smallCard",
	"h-64 aspect-[5/7] p-3 m-3 cursor-default select-none flex flex-col bg-slate-700 "
);
provide(
	"largeCard",
	"h-96 aspect-[5/7] p-3 m-3 cursor-default select-none flex flex-col bg-slate-700 "
);
provide(
	"gladiatorCard",
	"h-[23rem] aspect-[5/7] p-2 m-2 cursor-default select-none flex flex-col bg-slate-700 "
);
provide("cardTitle", "text-xl text-sky-400");
provide(
	"getOwner",
	computed(() => ownerData.value)
);
provide(
	"getTime",
	computed(() => timeData.value)
);
provide(
	"getUser",
	computed(() => userData.value)
);
provide(
	"getLogged",
	computed(() => isLoggedIn.value)
);

function doTick() {
		if (timeData.value && countDown <= 0) {
			countDown = timeTimer;
		} else if (countDown) {
			countDown -= 100;
			const percent = (countDown / timeTimer) * 100;
			toNextTick.value = parseInt(percent.toFixed());
		}
	}

onMounted(async () => {
	const title = useTitle();
	title.value = "Lanista";

	if (!isLoggedIn.value) {
		stageMain.value = "WelcomeMain";
	}
	updateOwner();
	const rpnse = await fetch(apiData + `/users/gameData`, {
		headers: { "Content-Type": "application/json" },
	});

	const gameData = await rpnse.json();
	console.log(" getting tick data, set to :", gameData.tick);


	if (!gameData.tick) {
		interval = setInterval(updateOwner, 1000);
	} else {
		interval = setInterval(updateOwner, gameData.tick);
	}
	timerInterval = setInterval(doTick, 100);
	timeTimer = gameData.tick;
	// this.toNextTick = this.timeTimer;
	countDown = timeTimer;
	const percent = countDown / timeTimer;

	toNextTick.value = percent.toFixed(2);

	if (isLoggedIn.value && tutorialArray.value.length) {
		showTutorialModal.value = true;
	}

});

onUnmounted(() => {
	clearInterval(interval);
	clearInterval(timerInterval);
})

function update() {
	isLoggedIn.value = auth.loggedIn();
	userData.value = auth.getUser();
	updateOwner();
	if (tutorialArray.value.length) {
		showTutorialModal.value = true;
	}
}

async function updateOwner() {
	// this.toNextTick = this.timeTimer;
	if (userData.value == null) {
		userData.value = auth.getUser();
	}
	
	if (isLoggedIn.value && apiData && auth.getUser()) {
		try {
			const rpnse = await fetch(apiData + `/owner/${auth.getUser().ownerId}`, {
				headers: { "Content-Type": "application/json" },
			});
			const oData = await rpnse.json();

			// What this piece of code below is instead of shocking gladiators and
			// creating new array with new refs, lets just update the old one
			// this should trigger refs better than recreating it completely.
			if (ownerData.value) {
				for (let index in oData.owner) {
					if (oData.owner[index] != ownerData.value[index]) {
						if (!oData.owner[index].length) {
							ownerData.value[index] = oData.owner[index];
						} else if (index == "gladiators") {
							if (oData.owner[index].length != ownerData.value[index].length) {
								ownerData.value[index] = oData.owner[index];
							} else {
								for (let gladIndex in oData.owner[index]) {
									let thisOne = oData.owner[index][gladIndex];
									let oldOne = ownerData.value[index][gladIndex];

									for (let info in thisOne) {
										if (info == "lastGain") {
											oldOne[info] = thisOne[info];
										} else if (thisOne[info] != oldOne[info]) {
											oldOne[info] = thisOne[info];
										}
									}
								}
							}
						} else if (
							oData.owner[index].length != ownerData.value[index].length
						) {
							ownerData.value[index] = oData.owner[index];
						}
					}
				}
			} else {
				ownerData.value = oData.owner;
			}

			timeData.value = oData.time;
			countDown = this.timeTimer;
		} catch (err) {
			//console.log(err, "clearing");
			// clearInterval(this.interval);
		}
	}
}

provide(
	"apiCall",
	computed(() =>{
		return apiData
	}
	)
);
provide("showTutorial", (tutorial) => {
	if (!localStorage.getItem(tutorial.elementId)) {
		setTimeout(() => {
			tutorialArray.value.push(tutorial);
			showTutorialModal.value = true;
			// console.log("ADDING TUTORIAL:",tutorial.message,this.tutorialArray,this.showTutorialModal);
		}, 750);
	}
});
let modalData = ref();
provide("modalData",
	computed(() => modalData.value)
);

provide("setModalData",	(gladData)=>{
		modalData.value ={
			gladData
		}
		console.log(modalData);
	})



provide("showCardTip", (message, type,gladData) => {
	toolTipType.value = "CardToolTipModal";
	toolTipContext.value = unref(message);
	contextType.value = unref(type);
	toolTipGladData.value = unref(gladData);
	showToolTipModal.value = true;
});
provide("hideToolTip", () => {
	showToolTipModal.value = false;
});
</script>

background-color: rgb(30 58 138);
<style>
body {
	background-color: rgb(30, 30, 30);
	color: rgb(200, 200, 200);
}
#app {
	height: 100vh;
}
</style>
height: 100vh; width: 100vw;
