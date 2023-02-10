<template>
	<div class="overflow-y-auto max-h-screen bg-blue-900 px-3 w-48">
		<div
			class="  font-lux text-base m-2 cursor-pointer sideOptions rounded hover:bg-blue-200 hover:text-black"
			@click="$emit('changeMain', 'WelcomeMain')">
			Home
		</div>

		<div v-if="isLoggedIn" class="font-lux text-base">
			<div
				class="m-2 cursor-pointer sideOptions rounded hover:bg-blue-200 hover:text-black"
				@click="$emit('changeMain', 'GladiatorsMain')">
				Gladiators
			</div>
			<div
				class="m-2 cursor-pointer sideOptions rounded hover:bg-blue-200 hover:text-black"
				@click="$emit('changeMain', 'SchoolMain')">
				School
			</div>
			<div
				class="m-2 cursor-pointer sideOptions rounded hover:bg-blue-200 hover:text-black"
				@click="$emit('changeMain', 'CombatMain')">
				Combat
			</div>
			<div
				class="m-2 cursor-pointer sideOptions rounded hover:bg-blue-200 hover:text-black"
				@click="$emit('changeMain', 'StoreMain')">
				Store
			</div>
			<div
				class="m-2 cursor-pointer sideOptions rounded hover:bg-blue-200 hover:text-black"
				@click="$emit('changeMain', 'StudentMain')">
				Students
			</div>
			<div
				class="m-2 cursor-pointer sideOptions rounded hover:bg-blue-200 hover:text-black"
				@click="$emit('changeMain', 'TournamentMain')">
				Tournament
			</div>
			
		</div>
	</div>
</template>

<script>
import auth from "./../mixins/auth";

export default {
	name: "SideNav",
	inject: ["getLogged","getOwner","getUser"],
	data() {
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
	padding: 1rem;
}
</style>
