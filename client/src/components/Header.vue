<template>
	<div class="bg-blue-900">
		<div class="flex justify-between text-center">
			<h1
				@click="$emit('changeMain', 'WelcomeMain')"
				class="cursor-pointer text-6xl text-center font-bold font-dot p-2 pl-4 flex justify-center items-center">
				Lanista
			</h1>
			<div
				class="flex w-1/2 justify-between items-center font-dot cursor-default">
				<div id="goldFame" class="flex w-1/3 p-4 justify-between">
					<h2 :class="cardTitle" v-if="getOwner">G: {{ getOwner.gold }}</h2>
					<h2 :class="cardTitle" v-if="getOwner">F: {{ getOwner.fame }}</h2>
				</div>				
				
				<div
					id="dateTutorial"
					v-if="getTime"
					class="p-4 flex w-1/2 justify-between"> 
					<h2 :class="cardTitle">{{ getTime.time }}:00</h2>
					<h2 :class="cardTitle">{{ dayMap[getTime.weekDay] }}day</h2>
					<h2 :class="cardTitle">
						{{ getTime.month }}/{{ getTime.day }}/{{ getTime.year }}
					</h2>
				</div>
				
				 <div id="tickTutorial" v-if="getTime" class="flex items-center">
					<ProgressBar :bgcolor="'#ccc'" :completed="parseInt(tickTimer)" />
					</div>
					
				</div>

			<div v-if="!isLoggedIn" class="flex justify-center items-center mr-5">
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
			<div
				v-else
				class="font-dot text-base flex justify-center items-center mr-5">
				<h2 class="mr-3 text-2xl text-slate-300 cursor-default">
					<template v-if="getUser">{{ getUser.username }}</template>
				</h2>
				<!-- <img @click="showModal('SettingModal')" :src="gearIcon" class="hover:cursor-pointer"/> -->
				<button :class="btnClass" @click="doLogOut">Logout</button>
			</div>
		</div>
		<div v-if="isModalShown">
			<component
				:is="components[modalShown]"
				@closeModal="closePopup"
				@trylogin="tryLogin"
				@createAcct="createAcct" />
		</div>
	</div>
</template>

<script setup>
import auth from "./../composables/auth";
import CreateAccountModal from "./modals/CreateAccountModal.vue";
import LoginModal from "./modals/LoginModal.vue";
import SettingModal from "./modals/SettingsModal.vue";

const getUser = inject("getUser");
const getOwner = inject("getOwner");
const getTime = inject("getTime");
const apiCall = inject("apiCall");
const showTutorial = inject("showTutorial");

const { tickTimer } = defineProps(["tickTimer"]);
const emit = defineEmits(["logged", "changeMain", "getUser"]);

const dayMap = {
	1: "ones",
	2: "twos",
	3: "threes",
	4: "fours",
	5: "fives",
	6: "sixes",
};
onMounted(async () => {
	if (isLoggedIn.value) {
		showTut();
	}
});
const btnClass = ref(
	"m-2 px-3 py-2 cursor-pointer font-dot text-xl hover= ref(underline sideOptions"
);
const cardTitle = ref("text-2xl text-slate-300 ");
const modalShown = ref(null);
const isModalShown = ref(null);
const isLoggedIn = ref(auth.loggedIn());

const components = {
	LoginModal,
	SettingModal,
	CreateAccountModal,
};

function closePopup() {
	isModalShown.value = false;
}
async function doLogOut() {
	auth.logout();
	emit("logged");
}
function showModal(targetModal) {
	modalShown.value = targetModal;
	isModalShown.value = true;
}
function showTut() {
	showTutorial({
		elementId: "dateTutorial",
		message: "This is the current tick and date",
		orientation: "bottom",
	});
	showTutorial({
		elementId: "goldFame",
		message: "Fame is an requirement, and gold to purchase things",
		orientation: "bottom",
	});
	showTutorial({
		elementId: "tickTutorial",
		message: "Timer to determine when the next tick will occur",
		orientation: "bottom",
	});
}
async function createAcct({ username, password, email }) {
	if (!username || !password || !email) {
		isModalShown.value = false;
		return;
	}
	const rpnse = await fetch(apiCall.value + `/users/createAcct`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			"username": unref(username),
			"password": unref(password),
			"email": unref(email),
		}),
	});
	let det = await rpnse.json();
	if (rpnse.status === 200) {
		isLoggedIn.value = true;
		auth.login(det.token);
	} else {
		console.log(det);
		alert(det.error);
	}
	emit("logged");
	isModalShown.value = false;
	showTut();
}

async function tryLogin({ username, password }) {
	if (!username || !password) {
		isModalShown.value = false;
		return;
	}
	const rpnse = await fetch(apiCall.value + "/users/login", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			"username": unref(username),
			"password": unref(password),
		}),
	});
	let det = await rpnse.json();
	if (rpnse.status === 200) {
		isLoggedIn.value = true;
		auth.login(det.token);
	} else {
		alert(det.error);
	}
	emit("logged");
	isModalShown.value = false;
	showTut();
}
</script>
<style scoped>
button {
	transition: all 0.5s linear;
}
</style>
