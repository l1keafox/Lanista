<template>
	<div class="overflow-y-auto max-h-screen bg-blue-900 w-48">
		<hr/>
		<div
		:class="butnLayout"
			@click="$emit('changeMain', 'WelcomeMain')">
			Home
		</div>
		<div
		:class="butnLayout"
			@click="$emit('changeMain', 'HowToPlayMain')">
			How To Play
		</div>
		<div
		:class="butnLayout"
			@click="$emit('changeMain', 'RankingMain')">
			Ranking
		</div>
		<div
			:class="butnLayout"
			@click="$emit('changeMain', 'feedbackMain')">
			Feedback/Bugs
		</div>
		<div
			:class="butnLayout"
			@click="$emit('changeMain', 'CreditMain')">
			Credit
		</div>

		<hr/>

		<div v-if="isLoggedIn" class="font-lux text-base">
			<div
				:class="butnLayout"
				id ="gladSideNav"
				@click="$emit('changeMain', 'GladiatorsMain')">
				Gladiators
			</div>
			<div
				:class="butnLayout"
				id ="schoolSideNav"
				@click="$emit('changeMain', 'SchoolMain')">
				School
			</div>
			<div
			:class="butnLayout"
			id ="combatSideNav"
				@click="$emit('changeMain', 'CombatMain')">
				Combat
			</div>
			<div
			:class="butnLayout"
			id ="storeSideNav"
				@click="$emit('changeMain', 'StoreMain')">
				Store
			</div>
			<div
			:class="butnLayout"
				@click="$emit('changeMain', 'StudentMain')">
				Students
			</div>
			<div
			:class="butnLayout"
				@click="$emit('changeMain', 'GamblingMain')">
				Gambling
			</div>
			<div
			:class="butnLayout"
				@click="$emit('changeMain', 'TournamentMain')">
				Tournament
			</div>
			
		</div>
		<hr/>
	</div>
</template>

<script>
import auth from "./../mixins/auth";

export default {
	name: "SideNav",
	inject: ["getLogged","getOwner","getUser",'showTutorial'],
	data() {
		this.butnLayout = "font-lux text-base text-center w-fill cursor-pointer sideOptions hover:bg-blue-200 hover:text-black py-4 select-none"
		return {
			showLoginModal: false,
			showCreateModal: false,
			ownerData: null,
			userData: null,
			isLoggedIn:  auth.loggedIn(),
		};
	},
	components: {
	},
	async mounted() {
		this.ownerData = this.getOwner;
		this.userData = this.getUser;
		this.isLoggedIn = this.getLogged;
		this.showTutorial({elementId:"gladSideNav",message:"Start here to see what gladiators you  have", orientation:"bottom"});
	},
	
	emits: ["logged", "changeMain","getUser"],
	methods: {
	},
};
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
