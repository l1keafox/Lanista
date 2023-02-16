<template>
	<div class = "bg-blue-900">
		<div class="flex justify-between text-center">
			<h1
				@click="$emit('changeMain', 'WelcomeMain')"
				class="cursor-pointer text-6xl text-center font-bold font-baby p-2 pl-4">
				Lanista
			</h1>
        <div class ="flex w-1/3 justify-between items-center font-lux">
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
			<div v-if="!isLoggedIn" class="flex justify-center items-center  mr-5">
				<button
					:class="btnClass"
					@click="showModal('CreateAccount')"
					:key="isLoggedIn">
					Create Account
				</button>
				<button
					:class="btnClass"
					@click="showModal('LoginVue')"
					:key="isLoggedIn">
					Login
				</button>
			</div>
      <div v-else class="font-lux text-base flex justify-center items-center mr-5">
				<h2 class ="mr-3 text-2xl text-slate-300"><template v-if="userData">{{ userData.username }}</template></h2>
				<img @click="showModal('SettingModal')" :src="gearIcon" class="hover:cursor-pointer"/>
        <button :class="btnClass" @click="doLogOut">Logout</button>
      </div>
		</div>
		<div v-if="isModalShown">
			<component :is="modalShown" @closeModal="closePopup" @trylogin="tryLogin"  @createAcct="createAcct"/>
		</div>
	
	</div>
</template>

<script>
import auth from "@/mixins/auth";
import gearIcon from "@/assets/gear_icon.png";

import LoginVue from "./LoginVue.vue";
import CreateAccount from "./CreateAccount.vue";
import SettingModal from "./SettingsModal.vue"
export default {
	name: "HeaderVue",
	inject: ["getUser","getOwner","cardTitle","getTime","apiCall"],
	emits: ["logged", "changeMain", "getUser"],
	data() {
		return {
			btnClass:"m-2 px-3 py-2 cursor-pointer font-lux text-xl hover:underline sideOptions",
			showLoginModal: false,
			showCreateModal: false,
			modalShown: null,
			isModalShown: null,
			gearIcon,
			userData: null,
      ownerData:null,
			timeData:null,
			isLoggedIn: auth.loggedIn()
		};
	},
	components: {
		LoginVue,
		SettingModal,
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
		showModal(targetModal){
			this.modalShown = targetModal
			this.isModalShown = true;
			console.log(this.modalShown,this.isModalShown);
		},	
		showLogin() {
			this.showLoginModal = !this.showLoginModal;
			//      console.log(this.showLoginModal);
		},
		async createAcct({ username, password, email }) {
			//      console.log('trying create');
			if (!username || !password || !email) {
				this.isModalShown = false;
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
				console.log(det);
				alert(det.error);
			}
			this.$emit("logged");
			this.ownerData = this.getOwner;
			this.userData = this.getUser;

			//this.updateOwner();
			this.isModalShown = false;
		},

		async tryLogin({ username, password }) {
			if (!username || !password) {
				this.isModalShown = false;
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

			this.isModalShown = false;
		},
		closePopup() {
			this.showLoginModal = false;
			this.showCreateModal = false;
			this.isModalShown = false;
		}
	},
};
</script>

<style scoped>
button {
	transition: all .5s linear;
}
</style>
