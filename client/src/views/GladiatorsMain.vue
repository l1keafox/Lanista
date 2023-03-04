<template>
	<div class="flex flex-wrap w-full overflow-y-scroll">
		<template
			v-if="getOwner"
			v-for="(glad, index) in getOwner.gladiators"
			:key="index">
			<GladiatorCard :glad="glad" :index="index" @openBigModal="openModal" />
		</template>
	</div>
	<div v-if="isModalShown" class="">
		<component
			:is="components[mShown]"
			:gladId="gladId"
			@closeModal="isModalShown = false" />
	</div>
</template>

<script setup>
import ScheduleManager from "./../components/modals/ScheduleManager.vue";
import HistoryModal from "../components/modals/GladiatorHistoryModal.vue";
import GladiatorDetails from "./../components/modals/GladiatorDetails.vue";
import GladiatorOptions from "./../components/modals/GladiatorOptions.vue";

const components = {
	ScheduleManager,
	HistoryModal,
	GladiatorDetails,
	GladiatorOptions
};

const getOwner = inject("getOwner");
const showTutorial = inject("showTutorial");

const isModalShown = ref(false);
const mShown = ref(false);
const gladId = ref(false);

function openModal({ gladiatorId, modalShown }) {
	mShown.value = modalShown;
	gladId.value = gladiatorId;
	isModalShown.value = true;
}

onMounted(() => {
	showTutorial({
		elementId: "detailsBtn0",
		message:
			"Click here to see your gladiator stats,equip equipment,and set your clash abilities",
		orientation: "bottom",
	});
	showTutorial({
		elementId: "scheduleBtn0",
		message:
			"Schedule, determine what stats to grow by selecting per tick training",
		orientation: "bottom",
	});
	showTutorial({
		elementId: "historyBtn0",
		message: "This is where you can see past duels and tournaments",
		orientation: "bottom",
	});

	showTutorial({
		elementId: "schoolSideNav",
		message:
			"School is where you can see what buildings, training, skills and items",
		orientation: "bottom",
	});
});

</script>

<style scoped></style>
