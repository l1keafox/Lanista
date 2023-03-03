<template>
	<div class="overflow-y-auto max-h-screen bg-blue-900 w-48">
		<hr/>
		<div
		:class="butnLayout"
			@click="emit('changeMain', 'WelcomeMain')">
			Home
		</div>
		<div
		:class="butnLayout"
		id ="howToPlayNav"
			@click="emit('changeMain', 'HowToPlayMain')">
			How To Play
		</div>
		<div
		:class="butnLayout"
			@click="emit('changeMain', 'RankingMain')">
			Ranking
		</div>
		<div
			:class="butnLayout"
			@click="emit('changeMain', 'feedbackMain')">
			Feedback/Bugs
		</div>
		<div
			:class="butnLayout"
			@click="emit('changeMain', 'CreditMain')">
			Credit
		</div>

		<hr/>

		<div v-if="isLoggedIn" class="font-dot text-base">
			<div
				:class="butnLayout"
				id ="gladSideNav"
				@click="emit('changeMain', 'GladiatorsMain')">
				Gladiators
			</div>
			<div
				:class="butnLayout"
				id ="schoolSideNav"
				@click="emit('changeMain', 'SchoolMain')">
				School
			</div>
			<div
			:class="butnLayout"
			id ="combatSideNav"
				@click="emit('changeMain', 'CombatMain')">
				Combat
			</div>
			<div
			:class="butnLayout"
			id ="storeSideNav"
				@click="emit('changeMain', 'StoreMain')">
				Store
			</div>
			<div
			:class="butnLayout"
			id ="studentsSideNav"
				@click="emit('changeMain', 'StudentMain')">
				Students
			</div>
			<div
			:class="butnLayout"
			id ="gamblingSideNav"
				@click="emit('changeMain', 'GamblingMain')">
				Gambling
			</div>
			<div
			:class="butnLayout"
			id ="tournamentSideNav"
				@click="emit('changeMain', 'TournamentMain')">
				Tournament
			</div>
			<div
			:class="butnLayout"
			id ="tournamentSideNav"
				@click="emit('changeMain', 'PvpMain')">
				PvP
			</div>
			
		</div>
		<hr/>
	</div>
</template>

<script setup>
import auth from "../composables/auth";
const getLogged = inject('getLogged')
const getOwner = inject('getOwner')
const getUser = inject('getUser')
const showTutorial = inject('showTutorial')

const butnLayout = "font-dot text-base text-center w-fill cursor-pointer sideOptions hover:bg-blue-200 hover:text-black py-4 select-none"
const showLoginModal= ref( false ) 
const showCreateModal= ref( false ) 
const ownerData= ref( null ) 
const userData= ref( null )
const isLoggedIn= ref(  auth.loggedIn() )

onMounted(() => {
		ownerData.value = getOwner;
		userData.value = getUser;
		isLoggedIn.value = getLogged;
		if(isLoggedIn){
			showTutorial({elementId:"gladSideNav",message:"Start here to see what gladiators you  have", orientation:"bottom"});
		}		
}),

onUpdated(() => {
	if(isLoggedIn){
			showTutorial({elementId:"gladSideNav",message:"Start here to see what gladiators you  have", orientation:"bottom"});
		}		
})

const emit = defineEmits( ["logged", "changeMain","getUser"])

// export default {
	
// 	emits: ["logged", "changeMain","getUser"],
// };
</script>

<style scoped>
#vue {
	opacity: 1;
}
.sideOptions {
	
	color: rgb(200, 200, 200);

	transition: all .5s linear;
}
</style>
