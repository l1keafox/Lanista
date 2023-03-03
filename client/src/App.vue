<template>
	<div class="flex flex-col h-screen w-screen overflow-hidden z-0 font-dot">
		<Header @logged="update" :tickTimer="toNextTick" />
		<div class="flex h-[calc(100vh-120px)] w-full">
			<SideNav @logged="update" @changeMain="changeStage" />
			<component :is="mainStage" />
		</div>
	</div>

	<BaseTutorialModal
		v-if="showTutorialModal && isLoggedIn"
		v-model="showTutorialModal"
		:tutorialArray="tutorialArray"
	/>	
	
	<component
		v-if="showToolTipModal"
		:context="toolTipContext"
		:type="contextType"
		:is="toolTipType"
	/>
 
		 
</template>

<script>
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
import PvpMain from "./views/PvpMain.vue"

import CardToolTipModal from "./components/modals/CardToolTipModal.vue";

import auth from "./composables/auth";
import { useTitle } from "@vueuse/core";

import { computed } from "vue";

export default {
	name: "App",
	components: {
		CardToolTipModal,
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
	},
	data() {
		this.timeTimer;
		this.countDown;
		this.contentArray;
		this.textWindow;
		this.interval;
		this.timerInterval;
		this.apiData =
			location.protocol === "https:"
				? `https://${window.location.hostname}`
				: `http://${window.location.hostname}:3001`;
		this.tutorialName;
		this.mountedDone = false;
		return {
			isLoggedIn: auth.loggedIn(),
			toolTipType:null,
			showTutorialModal: false,
			showToolTipModal: false,
			toolTipContext:null,
			contextType:null,
			mainStage: "WelcomeMain",
			timeData: null,
			toNextTick: 0,
			userData: null,
			ownerData: null,
			tutorialArray: [],
		};
	},
	methods: {
		doTick() {
			if (this.timeData && this.countDown <= 0) {
				this.countDown = this.timeTimer;
			} else if (this.countDown) {
				this.countDown -= 100;
				const percent = (this.countDown / this.timeTimer) * 100;
				this.toNextTick = parseInt(percent.toFixed());
			}
		},

		changeStage(newStage) {
			this.mainStage = newStage;
		},
		update() {
			this.isLoggedIn = auth.loggedIn();
			this.userData = auth.getUser();
			this.updateOwner();
			console.log("App Update", this.tutorialArray.length);
			if (this.tutorialArray.length) {
					this.showTutorialModal = true;
			}
		},

		async updateOwner() {
			// this.toNextTick = this.timeTimer;
			if (this.userData == null) {
				this.userData = auth.getUser();
			}
			if (this.isLoggedIn && this.apiData && auth.getUser()) {
				try {
					const rpnse = await fetch(
						this.apiData + `/owner/${auth.getUser().ownerId}`,
						{
							headers: { "Content-Type": "application/json" },
						}
					);
					const oData = await rpnse.json();

					// What this piece of code below is instead of shocking gladiators and
					// creating new array with new refs, lets just update the old one
					// this should trigger refs better than recreating it completely.
					if (this.ownerData) {
						for (let index in oData.owner) {
							if (oData.owner[index] != this.ownerData[index]) {
								if (!oData.owner[index].length) {
									this.ownerData[index] = oData.owner[index];
								} else if (index == "gladiators") {
									if (
										oData.owner[index].length != this.ownerData[index].length
									) {
										this.ownerData[index] = oData.owner[index];
									} else {
										for (let gladIndex in oData.owner[index]) {
											let thisOne = oData.owner[index][gladIndex];
											let oldOne = this.ownerData[index][gladIndex];

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
									oData.owner[index].length != this.ownerData[index].length
								) {
									this.ownerData[index] = oData.owner[index];
								}
							}
						}
					} else {
						this.ownerData = oData.owner;
					}

					this.timeData = oData.time;
					this.countDown = this.timeTimer;
				} catch (err) {
					//console.log(err, "clearing");
					// clearInterval(this.interval);
				}
			}
		},
	},
	unmounted() {
		clearInterval(this.interval);
		clearInterval(this.timerInterval);
	},
	async mounted() {
		const title = useTitle();
		title.value = "Lanista";

		if (!this.isLoggedIn) {
			this.mainStage = "WelcomeMain";
		}
		this.updateOwner();
		const rpnse = await fetch(this.apiData + `/users/gameData`, {
			headers: { "Content-Type": "application/json" },
		});

		const gameData = await rpnse.json();
		console.log(" getting tick data, set to :", gameData.tick);
		if (!gameData.tick) {
			this.interval = setInterval(this.updateOwner, 1000);
		} else {
			this.interval = setInterval(this.updateOwner, gameData.tick);
		}
		this.timerInterval = setInterval(this.doTick, 100);
		this.timeTimer = gameData.tick;
		// this.toNextTick = this.timeTimer;
		this.countDown = this.timeTimer;
		const percent = this.countDown / this.timeTimer;
		this.toNextTick = percent.toFixed(2);
		if (this.isLoggedIn && this.tutorialArray.length) {
			this.showTutorialModal = true;
		}
	},
	provide() {
		return {
			card: "h-80 w-56 p-3 m-3 cursor-default select-none flex flex-col bg-slate-700 ",
			smallCard:
				"h-64 aspect-[5/7] p-3 m-3 cursor-default select-none flex flex-col bg-slate-700 ",
			largeCard:
				"h-96 aspect-[5/7] p-3 m-3 cursor-default select-none flex flex-col bg-slate-700 ",
			gladiatorCard:
				"h-[27rem] aspect-[5/7] p-3 m-3 cursor-default select-none flex flex-col bg-slate-700 ",
			cardTitle: "text-xl text-sky-400",
			getOwner: computed(() => this.ownerData),
			getTime: computed(() => this.timeData),
			getUser: computed(() => this.userData),
			getLogged: computed(() => this.isLoggedIn),
			apiCall: computed(() => this.apiData),
			showTutorial: (tutorial) => {
				if (!localStorage.getItem(tutorial.elementId)) {
					setTimeout(() => {

					this.tutorialArray.push(tutorial);
					this.showTutorialModal = true;
					console.log("ADDING TUTORIAL:",tutorial.message,this.tutorialArray,this.showTutorialModal);
					}, 750);
				}
			},

			showCardTip:(message,type)=>{
				this.toolTipType = "CardToolTipModal"
				this.toolTipContext = unref(message);
				this.contextType = unref(type);
				this.showToolTipModal = true;
			},
			hideToolTip: ()=>{
				this.showToolTipModal = false;
			}

		};
	},
};
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
