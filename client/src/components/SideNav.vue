<template>
	<div class="overflow-y-auto max-h-screen bg-blue-900 px-3 w-48">
		<!-- <div  class="flex flex-col"> -->
			<!-- <button
				class="m-2 cursor-pointer sideOptions text-neo"
				@click="showLogin"
				:key="isLoggedIn">
				Login
			</button>
			<button
				class="m-2 cursor-pointer sideOptions text-neo"
				@click="showCreateAcct"
				:key="isLoggedIn">
				Create Account
			</button> -->
		<!-- </div> -->
		<div
			class="m-2 cursor-pointer sideOptions"
			@click="$emit('changeMain', 'WelcomeMain')">
			Home
		</div>

		<div v-if="isLoggedIn" class="font-lux text-base">
			<div
				class="m-2 cursor-pointer sideOptions"
				@click="$emit('changeMain', 'GladiatorsMain')">
				Gladiators
			</div>
			<div
				class="m-2 cursor-pointer sideOptions"
				@click="$emit('changeMain', 'SchoolMain')">
				School
			</div>
			<div
				class="m-2 cursor-pointer sideOptions"
				@click="$emit('changeMain', 'CombatMain')">
				Combat
			</div>
			<div
				class="m-2 cursor-pointer sideOptions"
				@click="$emit('changeMain', 'StoreMain')">
				Store
			</div>
			<div
				class="m-2 cursor-pointer sideOptions"
				@click="$emit('changeMain', 'TournamentMain')">
				Tournament
			</div>
			<div class="m-2 cursor-pointer sideOptions" @click="doLogOut">Logout</div>
		</div>
<!-- 
		<div v-if="showLoginModal">
			<LoginVue id="vue" @close="closePopup" @trylogin="tryLogin" />
		</div>
		<div v-if="showCreateModal">
			<CreateAccount id="vue" @close="closePopup" @createAcct="createAcct" />
		</div> -->
	</div>
</template>

<script>
import auth from "./../mixins/auth";

// import LoginVue from "./LoginVue.vue";
// import CreateAccount from "./CreateAccount.vue";

export default {
	name: "SideNav",
	inject: ["getLogged", "cardTitle", "smallCard","getOwner","getUser"],
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
		// LoginVue,
		// CreateAccount,
	},
	async mounted() {
		this.ownerData = this.getOwner;
		this.userData = this.getUser;
		this.isLoggedIn = this.getLogged;
		
	},
	
	emits: ["logged", "changeMain","getUser"],
	methods: {
		
		// async doLogOut() {
		// 	auth.logout();
		// 	this.$emit("logged");
		// },
		// async createAcct({ username, password, email }) {
		// 	//      console.log('trying create');
		// 	if (!username || !password || !email) {
		// 		this.showCreateModal = false;
		// 		return;
		// 	}
		// 	const rpnse = await fetch(
		// 		`http://${window.location.hostname}:3001/users/createAcct`,
		// 		{
		// 			method: "POST",
		// 			headers: { "Content-Type": "application/json" },
		// 			body: JSON.stringify({
		// 				"username": username,
		// 				"password": password,
		// 				"email": email,
		// 			}),
		// 		}
		// 	);
		// 	let det = await rpnse.json();
		// 	if (rpnse.status === 200) {
		// 		this.isLoggedIn = true;
		// 		auth.login(det.token);
		// 	} else {
		// 		alert("Cannot Create Acct");
		// 	}
		// 	this.$emit("logged");
		// 	this.ownerData = this.getOwner;
		// 	this.userData = this.getUser;

		// 	//this.updateOwner();
		// 	this.showCreateModal = false;
		// },

		// async tryLogin({ username, password }) {
		// 	if (!username || !password) {
		// 		this.showLoginModal = false;
		// 		return;
		// 	}
		// 	//      console.log("Trying login", username, password);
		// 	const rpnse = await fetch(
		// 		`http://${window.location.hostname}:3001/users/login`,
		// 		{
		// 			method: "POST",
		// 			headers: { "Content-Type": "application/json" },
		// 			body: JSON.stringify({ "username": username, "password": password }),
		// 		}
		// 	);
		// 	let det = await rpnse.json();
		// 	if (rpnse.status === 200) {
		// 		this.isLoggedIn = true;
		// 		auth.login(det.token);
		// 	} else {
		// 		alert("Cannot login");
		// 	}
		// 	this.$emit("logged");
		// 	//this.updateOwner();
		// 	this.ownerData = this.getOwner;
		// 	this.userData = this.getUser;

		// 	this.showLoginModal = false;
		// },
		// closePopup() {
		// 	this.showLoginModal = false;
		// 	this.showCreateModal = false;
		// },
		// showLogin() {
		// 	this.showLoginModal = !this.showLoginModal;
		// 	//      console.log(this.showLoginModal);
		// },
		// showCreateAcct() {
		// 	this.showCreateModal = !this.showCreateModal;
		// 	//    console.log(this.showLoginModal);
		// },
	},
};
</script>

<style scoped>
#vue {
	opacity: 1;
}
.sideOptions {
	background-color: rgb(200, 200, 200);
	color: black;
	padding: 1rem;
}
</style>
