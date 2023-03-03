<template>
	<div class="w-full overflow-x-hidden">
		<div v-if="structureData" class="flex overflow-x-auto">
			<div v-for="struct in structureData" :key="struct" :class="smallCard">
				<h1 :class="cardTitle">{{ struct.structure }}</h1>
				<hr />
				<p>{{ struct.description }}</p>
				<p>{{ struct.training }}</p>
			</div>
		</div>
		<hr />

		<div v-if="trainingData" class="flex overflow-x-auto">
			<div
				v-for="train in trainingData"
				:key="train"
				:class="smallCard"
				class="flex justify-between">
				<div>
					<h1 :class="cardTitle">{{ train.training }}</h1>
					<hr />
				</div>
				<div>
					<template
						v-for="(bonus, key) in trainJson[train.training]"
						:key="key">
						<template v-if="bonus.min">
							<h3>{{ key }} {{ bonus.min }}-{{ bonus.max }}</h3>
						</template>
						<template v-else-if="bonus.diceSide">
							<h3>{{ key }} {{ bonus.diceNumber }}d{{ bonus.diceSide }}</h3>
						</template>
					</template>
				</div>

				<button class="bg-red-500 text-black">disable</button>
			</div>
		</div>
		<hr />
		<div v-if="learningData" class="flex overflow-x-auto">
			<div v-for="skill in learningData" :key="skill" :class="smallCard">
				<h1 :class="cardTitle">{{ skill.learning }}</h1>
				<hr />
				<p>{{ skill.description }}</p>
				<p>learning speed: {{ skill.learnSpeed }}</p>
			</div>
		</div>
		<hr />
		<div v-if="inventory" class="flex overflow-x-auto">
			<div v-for="item in inventory" :key="item" :class="smallCard">
				<h2 :class="cardTitle">{{ item.item }}</h2>
				<hr />
				<h2>amount:{{ item.amount }}</h2>
				<h2>abilities:{{ item.abilities }}</h2>
				<h2>slot:{{ item.slot }}</h2>
				<h2>maintenance:{{ item.maintenance }}</h2>
			</div>
		</div>
	</div>
</template>

<script setup>
import cacheJson from "../composables/cacheJson";

const trainJson = ref();
const structureData = ref(null);
const trainingData = ref(null);
const inventory = ref(null);
const learningData = ref(null);

const getUser = inject('getUser');
const cardTitle = inject("cardTitle");
const smallCard = inject("smallCard");
const apiCall = inject("apiCall");
const showTutorial = inject("showTutorial");

onMounted(async () => {
	trainJson.value = await cacheJson(`/assets/json/training`, apiCall.value);
	const rpnse = await fetch(
		apiCall.value + `/owner/structuresData/${getUser.value.ownerId}`,
		{
			headers: { "Content-Type": "application/json" },
		}
	);
	structureData.value = await rpnse.json();

	const rpnse3 = await fetch(
		apiCall.value + `/owner/trainingData/${getUser.value.ownerId}`,
		{
			headers: { "Content-Type": "application/json" },
		}
	);
	trainingData.value = await rpnse3.json();

	const rpnse2 = await fetch(
		apiCall.value + `/owner/learningData/${getUser.value.ownerId}`,
		{
			headers: { "Content-Type": "application/json" },
		}
	);
	learningData.value = await rpnse2.json();

	const inventoryed = await fetch(
		apiCall.value + `/owner/inventoryData/${getUser.value.ownerId}`,
		{ headers: { "Content-Type": "application/json" } }
	);
	inventory.value = await inventoryed.json();

	showTutorial({
		elementId: "combatSideNav",
		message: "Combat is where you can spar, these will not effect your record.",
		orientation: "bottom",
	});
});
</script>

<style scoped></style>
