<template>
	<div class = "bg-blue-900">
		<div class="flex justify-between text-center">
			<h1
				@click="$emit('changeMain', 'WelcomeMain')"
				class="cursor-pointer text-6xl text-center font-bold font-baby p-2 pl-4">
				Lanista
			</h1>
        <div class ="flex w-1/3 justify-between items-center font-lux cursor-default">
					<div class="flex w-1/3 justify-between">
						<h2 :class ="cardTitle" v-if="ownerData" >G: {{ ownerData.gold }} </h2>
						<h2 :class ="cardTitle" v-if="ownerData" >F: {{ ownerData.fame }} </h2>
					</div>
					<div v-if="timeData" class="flex w-1/2  justify-between">
						<h2 :class ="cardTitle">{{timeData.time}}:00</h2>
						<h2 :class ="cardTitle">{{this.dayMap[timeData.weekDay]}}day</h2>
						<h2 :class ="cardTitle">{{timeData.month}}/{{timeData.day}}/{{timeData.year}} </h2>
					</div>
        </div>
				<div v-if="timeData" class ="flex items-center" >
					<ProgressBar :bgcolor="'#6a1b9a'" :completed ="tickTimer"/>
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
				<h2 class ="mr-3 text-2xl text-slate-300 cursor-default"><template v-if="userData">{{ userData.username }}</template></h2>
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
import ProgressBar from "./ProgressBar.vue"
export default {
	name: "HeaderVue",
	inject: ["getUser","getOwner","getTime","apiCall"],
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
		this.gearIcon = gearIcon
		return {
			btnClass:"m-2 px-3 py-2 cursor-pointer font-lux text-xl hover:underline sideOptions",
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
		LoginVue,
		SettingModal,
		ProgressBar,
		CreateAccount,
	},

	async mounted() {
		this.userData = this.getUser;
    this.ownerData = this.getOwner;
		this.timeData = this.getTime;
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
				alert(det.error);
			}
			this.$emit("logged");
			this.ownerData = this.getOwner;
			this.userData = this.getUser;
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
