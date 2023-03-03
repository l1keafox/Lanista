<template>
	<div class = "bg-blue-900">
		<div class="flex justify-between text-center">
			<h1
				@click="$emit('changeMain', 'WelcomeMain')"
				class="cursor-pointer text-6xl text-center font-bold font-dot p-2 pl-4 flex justify-center items-center">
				Lanista
			</h1>
        <div class ="flex w-1/2 justify-between items-center font-dot cursor-default">
					<div id="goldFame" class="flex w-1/3 p-4 justify-between">
						<h2 :class ="cardTitle" v-if="ownerData" >G: {{ ownerData.gold }} </h2>
						<h2 :class ="cardTitle" v-if="ownerData" >F: {{ ownerData.fame }} </h2>
					</div>
					<div id="dateTutorial" v-if="timeData" class="p-4 flex w-1/2  justify-between">
						<h2 :class ="cardTitle">{{timeData.time}}:00</h2>
						<h2 :class ="cardTitle">{{this.dayMap[timeData.weekDay]}}day</h2>
						<h2 :class ="cardTitle">{{timeData.month}}/{{timeData.day}}/{{timeData.year}} </h2>
					</div>
        </div>
				<div id="tickTutorial" v-if="timeData" class ="flex items-center" >
					<ProgressBar :bgcolor="'#6a1b9a'" :completed ="tickTimer"/>
				</div>

			<div v-if="!isLoggedIn" class="flex justify-center items-center  mr-5">
				<button
					:class="btnClass"
					@click="showModal('CreateAccountModal')"
					:key="isLoggedIn">
					Create Account
				</button>
				<button
					:class="btnClass"
					@click="showModal('LoginModal')"
					:key="isLoggedIn">
					Login
				</button>
			</div>
      <div v-else class="font-dot text-base flex justify-center items-center mr-5">
				<h2 class ="mr-3 text-2xl text-slate-300 cursor-default"><template v-if="userData">{{ userData.username }}</template></h2>
				<!-- <img @click="showModal('SettingModal')" :src="gearIcon" class="hover:cursor-pointer"/> -->
        <button :class="btnClass" @click="doLogOut">Logout</button>
      </div>
		</div>
		<div v-if="isModalShown" >
			<component :is="modalShown" @closeModal="closePopup" @trylogin="tryLogin"  @createAcct="createAcct"/>
		</div>
	
	</div>
</template>

<script>
import auth from "../composables/auth";

import CreateAccountModal from "./modals/CreateAccountModal.vue";
import LoginModal from "./modals/LoginModal.vue";
import SettingModal from "./modals/SettingsModal.vue"

export default {
	name: "HeaderVue",
	inject: ["getUser","getOwner","getTime","apiCall","showTutorial"],
	props:[ "tickTimer"],
	emits: ["logged", "changeMain", "getUser"],
	data() {
		this.dayMap = {
			1:"ones",
			2:"twos",
			3:"threes",
			4:"fours",
			5:"fives",
			6:"sixes",
		}
		// this.gearIcon = gearIcon
		return {
			btnClass:"m-2 px-3 py-2 cursor-pointer font-dot text-xl hover:underline sideOptions",
			cardTitle:"text-2xl text-slate-300 ",
			modalShown: null,
			isModalShown: null,
			userData: null,
      ownerData:null,
			timeData:null,
			isLoggedIn: auth.loggedIn()
		};
	},
	components: {
		LoginModal,
		SettingModal,
		CreateAccountModal
	},

	async mounted() {
		this.userData = this.getUser;
    this.ownerData = this.getOwner;
		this.timeData = this.getTime;
		if(this.isLoggedIn){
			this.showTut()
		}
		
	},
	methods: {
		closePopup(){
			this.isModalShown = false;
		},
		async doLogOut() {
			auth.logout();
			this.$emit("logged");
		},
		showModal(targetModal){
			this.modalShown = targetModal
			this.isModalShown = true;
		},
		showTut(){
		this.showTutorial({elementId:"dateTutorial",message:"This is the current tick and date", orientation:"bottom"});
		this.showTutorial({elementId:"goldFame",message:"Fame is an requirement, and gold to purchase things", orientation:"bottom"});
		this.showTutorial({elementId:"tickTutorial",message:"Timer to determine when the next tick will occur", orientation:"bottom"});

		},
		async createAcct({ username, password, email }) {
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
						"username": unref(username),
						"password": unref(password),
						"email": unref(email),
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
			this.isModalShown = false;
			this.showTut()
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
				alert(det.error);
			}
			this.$emit("logged");
			this.ownerData = this.getOwner;
			this.userData = this.getUser;
			this.isModalShown = false;
			this.showTut()
		}
	},
};
</script>

<style scoped>
button {
	transition: all .5s linear;
}
</style>
