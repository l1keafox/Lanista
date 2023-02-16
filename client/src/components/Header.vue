<template>
	<div class = "">
		<div class="flex justify-between text-center">
			<h1
				@click="$emit('changeMain', 'WelcomeMain')"
				class="cursor-pointer text-4xl text-center font-bold font-lux p-2 pl-4">
				LANISTA
			</h1>
            <div class ="flex w-2/3 justify-between items-center">
				<h2 :class ="cardTitle">Username: <template v-if="userData">{{ userData.username }}</template></h2>
				<h2 :class ="cardTitle">GOLD: <template v-if="ownerData"> {{ ownerData.gold }}</template></h2>
				<h2 :class ="cardTitle">FAME: <template v-if="ownerData"> {{ ownerData.fame }}</template></h2>
				<div v-if="timeData" class="flex">
					<h2 :class ="cardTitle">{{timeData.time}}:00</h2>
					::
					<h2 :class ="cardTitle">{{timeData.day}}/{{timeData.month}}/{{timeData.year}} </h2>
					::
					<h2 :class ="cardTitle">{{timeData.weekDay}}WeekDay</h2>
				</div>
            </div>
			<div v-if="!isLoggedIn" class="flex justify-center items-center">
				<button
					class="my-2 px-2 cursor-pointer sideOptions text-neo rounded"
					@click="showCreateAcct"
					:key="isLoggedIn">
					Create Account
				</button>
				<button
					class="m-2 px-2 cursor-pointer sideOptions text-neo rounded"
					@click="showLogin"
					:key="isLoggedIn">
					Login
				</button>
			</div>
            <div v-else class="font-lux text-base flex justify-center items-center">
                <div class="m-2 px-2 cursor-pointer sideOptions rounded" @click="doLogOut">Logout</div>
            </div>
		</div>
		<div v-if="showLoginModal">
			<LoginVue id="vue" @close="closePopup" @trylogin="tryLogin" />
		</div>
		<div v-if="showCreateModal">
			<CreateAccount id="vue" @close="closePopup" @createAcct="createAcct" />
		</div>
	</div>
</template>

<script>
import auth from "@/mixins/auth";

import LoginVue from "./LoginVue.vue";
import CreateAccount from "./CreateAccount.vue";

export default {
	name: "HeaderVue",
	inject: ["getUser","getOwner","cardTitle","getTime","apiCall"],
	emits: ["logged", "changeMain", "getUser"],
	data() {
		return {
			showLoginModal: false,
			showCreateModal: false,
			userData: null,
            ownerData:null,
			timeData:null,
			isLoggedIn: auth.loggedIn()
		};
	},
	components: {
		LoginVue,
		CreateAccount,
	},

	async mounted() {
		this.userData = this.getUser;
        this.ownerData = this.getOwner;
		this.timeData = this.getTime;
        //this.isLoggedIn = this.userData.isLoggedIn();
	},
	methods: {
		async doLogOut() {
			auth.logout();
			this.$emit("logged");
		},

		showLogin() {
			this.showLoginModal = !this.showLoginModal;
			//      console.log(this.showLoginModal);
		},
		async createAcct({ username, password, email }) {
			//      console.log('trying create');
			if (!username || !password || !email) {
				this.showCreateModal = false;
				return;
			}
			const rpnse = await fetch(
				this.apiCall.value+ `/users/createAcct`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						"username": username,
						"password": password,
						"email": email,
					}),
				}
			);
			let det = await rpnse.json();
			if (rpnse.status === 200) {
				this.isLoggedIn = true;
				auth.login(det.token);
			} else {
				alert("Cannot Create Acct");
			}
			this.$emit("logged");
			this.ownerData = this.getOwner;
			this.userData = this.getUser;

			//this.updateOwner();
			this.showCreateModal = false;
		},

		async tryLogin({ username, password }) {
			if (!username || !password) {
				this.showLoginModal = false;
				return;
			}
			const rpnse = await fetch(
				this.apiCall.value+'/users/login',
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ "username": username, "password": password }),
				}
			);
			let det = await rpnse.json();
			if (rpnse.status === 200) {
				this.isLoggedIn = true;
				auth.login(det.token);
			} else {
				alert("Cannot login");
			}
			this.$emit("logged");
			//this.updateOwner();
			this.ownerData = this.getOwner;
			this.userData = this.getUser;

			this.showLoginModal = false;
		},
		closePopup() {
			this.showLoginModal = false;
			this.showCreateModal = false;
		},
		showCreateAcct() {
			this.showCreateModal = !this.showCreateModal;
			//    console.log(this.showLoginModal);
		},
	},
};
</script>

<style scoped>
.sideOptions {
	background-color: rgb(200, 200, 200);
	color: black;
}
</style>
