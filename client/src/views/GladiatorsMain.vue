<template>
	<div class="flex flex-wrap w-full overflow-y-scroll">
		<template
			v-if="ownerData"
			v-for="(glad, index) in ownerData.gladiators"
			:key="index">
			<GladiatorCard :glad="glad" :index="index" @openBigModal="gladModal" />
		</template>
	</div>
	<div v-if="isModalShown" class="">
		<component
			:is="mShown"
			:gladId="gladId"
			@closeModal="isModalShown = false" />
	</div>
</template>

<script>
import ScheduleManager from "./../components/modals/ScheduleManager.vue";
import HistoryModal from "./../components/modals/HistoryModal.vue";
import GladiatorDetails from "./../components/modals/GladiatorDetails.vue";

import GladiatorCard from "../components/GladiatorCard.vue";

export default {
	name: "GladiatorMain",
  data(){
    return {
      isModalShown :false,
      mShown : false,
      gladId : false,
      ownerData: false,

    }

  },
  methods:{
    gladModal({ gladiatorId, modalShown }) {
			this.mShown = modalShown;
			this.gladId = gladiatorId;
			// console.log(mShown, gladId, isModalShown);
			this.isModalShown = true;
		}
  },
  inject:["getOwner","showTutorial"],
  mounted(){
    this.ownerData = this.getOwner;
    this.showTutorial({
				elementId: "detailsBtn0",
				message:
					"Click here to see your gladiator stats,equip equipment,and set your clash abilities",
				orientation: "bottom",
			});
			this.showTutorial({
				elementId: "scheduleBtn0",
				message: "Schedule, determine what stats to grow by selecting per tick training",
				orientation: "bottom",
			});
			this.showTutorial({
				elementId: "historyBtn0",
				message: "This is where you can see past duels and tournaments",
				orientation: "bottom",
			});
  },
	components: {
		GladiatorCard,
		ScheduleManager,
		HistoryModal,
		GladiatorDetails,
	},
};
</script>

<style scoped></style>
