<template>
	<div class="flex flex-col w-full overflow-x-hidden">
		<div v-if="showStudent" class="flex overflow-x-auto">
			<template v-for="(student, index) in showStudent" :key="index">
				<div :class="gladiatorCard">
					<h1 :class="cardTitle">{{ student.name }}</h1>
					<hr />
					<h1>strength: {{ student.strength }}</h1>
					<h1>dexterity: {{ student.dexterity }}</h1>
					<h1>agility: {{ student.agility }}</h1>
					<h1>constitution: {{ student.constitution }}</h1>
					<h1>vitality: {{ student.vitality }}</h1>

					<hr />
					<h1>intelligence: {{ student.intelligence }}</h1>
					<h1>wisdom: {{ student.wisdom }}</h1>
					<h1>bravery: {{ student.bravery }}</h1>
					<h1>sensitivity: {{ student.sensitivity }}</h1>
					<hr />
					<h1>luck: {{ student.luck }}</h1>
					<h1>charisma: {{ student.charisma }}</h1>
					<h1>reputation: {{ student.reputation }}</h1>
					<hr />

					<button
						@click="buyNewGlad($event)"
						class="bg-orange-700 p-2 w-64 m-3"
						:data-index="index">
						Buy New Student
					</button>
				</div>
			</template>
		</div>
		<div class="justify-center text-center">
			<button @click="getNewGlad" class="bg-blue-700 p-2 w-64 m-3">
				Find New Gladiator
			</button>
		</div>
		<!-- <div>
			<hr />
			<h1>Physical Stats</h1>
			<h2>Strength - determines how hard your physical attacks are.</h2>
			<h2>Dexterity - Determines if you hit with your attacks.</h2>
			<h2>Agility - Determines physical miss chance(dodge)</h2>
			<h2>constitution - Determines Hit points and other defensive stats.</h2>
			<h2>vitality - determines Stamina</h2>

			<hr />
			<h1>Mental Stats</h1>
			<h2>
				intelligence - Determines mana, spells, and has small influnce in many
				actions.
			</h2>
			<h2>wisdom - Experience, has influence over many actions</h2>
			<h2>Bravery - Determines Morale</h2>
			<h2>Sensitivity - Has influence over many actions</h2>
			<hr />
			<h1>Social Stats</h1>
			<h2>Luck - Has influence over many actions</h2>
			<h2>Charisma - Has influence over morale attacks(taunt)</h2>
			<h2>Reputation - Determines Morale</h2>
		</div> -->
	</div>
</template>

<script setup>
const gladiatorCard = inject("gladiatorCard");
const getOwner = inject("getOwner");
const cardTitle = inject("cardTitle");
const apiCall = inject("apiCall");
const showTutorial = inject("showTutorial");

const showStudent = ref(null);

onMounted(() => {
	getNewGladiator();
	showTutorial({
		elementId: "howToPlayNav",
		message: "Click here to learn about everything else ",
		orientation: "right",
	});
}),
	async function getNewGlad() {
		getNewGladiator();
	};

async function buyNewGlad(event) {
	const index = event.target.getAttribute("data-index");
	const rpnse = await fetch(apiCall.value + `/owner/buyStudent`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			"gladName": showStudent.value.name,
			"ownerId": getOwner.value.id,
			index,
		}),
	});

	alert('Student purchased,');
	showStudent.value.splice(index, 1);

	await rpnse.json();
}
async function getNewGladiator() {
	const rpnse = await fetch(
		apiCall.value + `/owner/getStudent/${getOwner.value.id}`,
		{
			headers: { "Content-Type": "application/json" },
		}
	);
	showStudent.value = await rpnse.json();

	showStudent.value.forEach((glad) => {
		glad.score = (
			(glad.strength +
				glad.dexterity +
				glad.agility +
				glad.constitution +
				glad.vitality +
				glad.luck +
				glad.charisma +
				glad.reputation +
				glad.intelligence +
				glad.wisdom +
				glad.bravery +
				glad.sensitivity) /
			13
		).toFixed();
	});
}
</script>

<style scoped></style>
