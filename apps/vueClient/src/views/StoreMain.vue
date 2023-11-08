<template>
	<div class="w-full overflow-x-hidden">
		<div v-if="structData" class="flex overflow-x-auto">
			<template v-for="(struct, index) in structData" :key="index">
				<itemCard :data="struct" @buyThing="tryBuy('structData', index)" />
			</template>
		</div>
		<hr />
		<div v-if="headData" class="flex overflow-x-auto">
			<template v-for="(item, index) in headData" :key="index">
				<itemCard :data="item" @buyThing="tryBuy('headData', index)" />
			</template>
		</div>
		<hr />
		<div v-if="bodyData" class="flex overflow-x-auto">
			<template v-for="(item, index) in bodyData" :key="index">
				<itemCard :data="item" @buyThing="tryBuy('bodyData', index)" />
			</template>
		</div>
		<hr />
		<div v-if="mainData" class="flex overflow-x-auto">
			<template v-for="(item, index) in mainData" :key="index">
				<itemCard :data="item" @buyThing="tryBuy('mainData', index)" />
			</template>
		</div>
		<hr />
		<div v-if="offData" class="flex overflow-x-auto">
			<template v-for="(item, index) in offData" :key="index">
				<itemCard :data="item" @buyThing="tryBuy('offData', index)" />
			</template>
		</div>
		<hr />
		<div v-if="bootsData" class="flex overflow-x-auto">
			<template v-for="(item, index) in bootsData" :key="index">
				<itemCard :data="item" @buyThing="tryBuy('bootsData', index)" />
			</template>
		</div>
		<hr />
	</div>
</template>

<script setup>
import auth from "../composables/auth";

const card = inject("card");
const cardTitle = inject("cardTitle");
const smallCard = inject("smallCard");
const apiCall = inject("apiCall");
const showTutorial = inject("showTutorial");
const userData = ref(auth.getUser());
const itemData = ref(null);
const headData = ref([]);
const bodyData = ref([]);
const mainData = ref([]);
const offData = ref([]);
const bootsData = ref([]);
const structData = ref(null);

onMounted(() => {
	updateStore();
	showTutorial({
		elementId: "studentsSideNav",
		message: "Student tab is where you can get new gladiators",
		orientation: "bottom",
	});
})
	async function tryBuy(type, index) {
    
		let buyThisThing = this[type][index];
		const rpnse = await fetch(apiCall.value + `/owner/buyItem`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ "id": userData.value._id, buyThisThing }),
		});
		let success = await rpnse.json();

		console.log("Buying:", buyThisThing, "Result", success);
		if (success) {
			alert("Bought Item");
			updateStore();
		} else {
			console.log("Not enough gold");
		}
	}

async function updateStore() {
	const rpnse = await fetch(
		apiCall.value + `/owner/store/${userData.value.ownerId}`,
		{
			headers: { "Content-Type": "application/json" },
		}
	);
	const storeData = await rpnse.json();
	headData.value = [];
	bodyData.value = [];
	offData.value = [];
	mainData.value = [];
	bootsData.value = [];
	storeData.items.forEach((it) => {
		switch (it.slot) {
			case "head":
				headData.value.push(it);
				break;
			case "body":
				bodyData.value.push(it);
				break;
			case "offHand":
				offData.value.push(it);
				break;
			case "mainHand":
				mainData.value.push(it);
				break;
			case "boots":
				bootsData.value.push(it);
				break;
		}
	});
	itemData.value = storeData.items;
	structData.value = storeData.structures;
}


</script>

<style scoped></style>
