<template>
	<div class="flex flex-col h-screen w-screen overflow-hidden">

		<HeaderVue @logged="update" :tickTimer="toNextTick" />
		<div class="flex h-[calc(100vh-120px)] w-full">
			<SideNav @logged="update" @changeMain="changeStage" />
			<component :is="mainStage" />
		</div>
	</div>
	<BaseTutoralModal v-if="showTutorialModal" v-model="showTutorialModal" :tutorialName="tutorialName" :tutorialArray="contentArray"/>

</template>

<script>
import WelcomeMain from "./views/WelcomeMain.vue";
import HowToPlayMain from "./views/HowToPlayMain.vue";
import GladiatorsMain from "./views/GladiatorsMain.vue";
import SchoolMain from "./views/SchoolMain.vue";
import CombatMain from "./views/CombatMain.vue";
import StoreMain from "./views/StoreMain.vue";
import TournamentMain from "./views/TournamentMain.vue";
import StudentMain from "./views/StudentMain.vue";
import FeedbackMain from "./views/FeedbackMain.vue";
import RankingMain from "./views/RankingMain.vue";
import GamblingMain from "./views/GamblingMain.vue";
import CreditMain from "./views/CreditMain.vue";


import SideNav from "./components/SideNav.vue";
import HeaderVue from "./components/Header.vue";
import BaseTutoralModal from "./components/modals/BaseTutorialModal.vue";
import auth from "./mixins/auth";
import {useTitle} from '@vueuse/core'

import { computed } from "vue";

export default {
	name: "App",
	components: {
		BaseTutoralModal,
		RankingMain,
		CreditMain,
		GamblingMain,
		FeedbackMain,
		SideNav,
		HowToPlayMain,
		StudentMain,
		HeaderVue,
		WelcomeMain,
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
		this.apiData = location.protocol === "https:" ? `https://${window.location.hostname}` : `http://${window.location.hostname}:3001`
		this.tutorialName;
		return {
			isLoggedIn: auth.loggedIn(),
			showTutorialModal: false,
			mainStage: "WelcomeMain",
			timeData: null,
			toNextTick: 0,
			userData: null,
			ownerData: null,
		};
	},
	methods: {
		doTick(){
			if(this.timeData && this.countDown <= 0 ){
				this.countDown = this.timeTimer
			} else if(this.countDown){
				this.countDown -= 100;
				const percent = (this.countDown / this.timeTimer)*100;
				this.toNextTick = parseInt( percent.toFixed() );
			}
		},	
		
		changeStage(newStage) {
			this.mainStage = newStage;
		},
		update() {
			this.isLoggedIn = auth.loggedIn();
			this.userData = auth.getUser();
			this.updateOwner();
		},

		async updateOwner() {
			// this.toNextTick = this.timeTimer;
			if (this.userData == null) {
				this.userData = auth.getUser();
			}
			if (this.isLoggedIn && this.apiData && auth.getUser() ) {
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
					if(this.ownerData){
						for(let index in oData.owner){
							if(oData.owner[index] != this.ownerData[index]){
								if(!oData.owner[index].length){
									this.ownerData[index] = oData.owner[index]
								} else if(index == 'gladiators'){
									if( oData.owner[index].length != this.ownerData[index].length){
										this.ownerData[index] = oData.owner[index]
									} else {
										for(let gladIndex in oData.owner[index]){
											let thisOne = oData.owner[index][gladIndex];
											let oldOne = this.ownerData[index][gladIndex];

												for(let info in thisOne){
													if(info == 'lastGain'){
														oldOne[info] = thisOne[info];
													} else if(thisOne[info] != oldOne[info] ) {
														oldOne[info] = thisOne[info];
													}
												}
										}
									}
								} else if(oData.owner[index].length != this.ownerData[index].length ) {
									this.ownerData[index] = oData.owner[index]
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
		title.value = "Lanista"
		
		if(!this.isLoggedIn){
			this.mainStage = "WelcomeMain"
		}
		this.updateOwner();
			const rpnse = await fetch(
			this.apiData + `/users/gameData`,
				{ headers: { "Content-Type": "application/json" } }
			);

		const gameData = await rpnse.json();
		console.log(' getting tick data, set to :',gameData.tick)
		if(!gameData.tick){
			this.interval = setInterval(this.updateOwner, 1000);
		} else {
			this.interval = setInterval(this.updateOwner, gameData.tick);
		}
		this.timerInterval = setInterval(this.doTick, 100);
		this.timeTimer = gameData.tick;
		// this.toNextTick = this.timeTimer;
		this.countDown = this.timeTimer;
		const percent = (this.countDown / this.timeTimer);
		this.toNextTick = percent.toFixed(2);

	},
	provide() {
		return {
			card: "h-80 w-56 p-3 m-3 cursor-default select-none flex flex-col bg-slate-700 rounded-lg",
			smallCard: "h-64 aspect-[5/7] p-3 m-3 cursor-default select-none flex flex-col bg-slate-700 rounded-lg",
			largeCard: "h-96 aspect-[5/7] p-3 m-3 cursor-default select-none flex flex-col bg-slate-700 rounded-lg",
			gladiatorCard: "h-[27rem] aspect-[5/7] p-3 m-3 cursor-default select-none flex flex-col bg-slate-700 rounded-lg",
			cardTitle: "text-xl text-sky-400",
			getOwner: computed(() => this.ownerData),
			getTime: computed(() => this.timeData),
			getUser: computed(() => this.userData),
			getLogged: computed(() => this.isLoggedIn),
			apiCall: computed(() => this.apiData),
			showTutorial: (vue,contentArray)=>{
				console.log("Show tutorial?", auth.getUser().showTutorial);
				console.log(contentArray);
				// if(auth.getUser().showTutorial && !localStorage.getItem(vue)){
					console.log('trigger show',vue,contentArray);
					// this.showWindow = {height:"100px",width:"100px",top:"20rem",left:"20rem"};
					// this.textWindow = {content:"Hi",style:null};
					this.showTutorialModal = true;
					this.tutorialName = vue;
					this.contentArray = contentArray;
//				}
				// Here we will check if it has already been shown, via localStorage
				// If not, we will showTutorail true
				// then we will 
			},
		};
	},
};
</script>

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
