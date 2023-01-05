<template>
  <div>
    <h1>Gladiators</h1>
    <div  v-if="ownerData" class="flex justify-center items-center" > 
        <div v-for="glad in ownerData.gladiators" :key="glad" class="h-80 aspect-[5/7] p-3 m-3 cursor-default select-none flex flex-col bg-slate-700"> 
        
        <h1>{{glad.name}} </h1>
        <hr/>
        <button class="bg-yellow-200 m-2 text-purple-900" @click="openManager($event)" :data-id="glad._id">schedule  </button>
        <button class="bg-blue-200 m-2 text-purple-700" @click="openStats($event)" :data-id="glad._id">stats  </button>
        <button class="bg-red-200 m-2 text-purple-700" @click="openEquipment($event)" :data-id="glad._id">equipment  </button>
        <button class="bg-green-200 m-2 text-purple-700" @click="openClash($event)" :data-id="glad._id">Clash  </button>
      </div>
    </div>
  </div>
  <div v-if="showScheduleManager">
    <ScheduleManager :gladId="gladiatorId" @closeModal="closeManager"/>
  </div>
  <div v-if="showGladiatorStats">
    <GladiatorStats :gladId="gladiatorId" @closeModal="closeStats"/>
  </div>
  <div v-if="showEquipmentScreen">
    <EquipmentScreen :gladId="gladiatorId" @closeModal="closeEquipment"/>
  </div>
  <div v-if="showClashSettings">
    <ClashSettings :gladId="gladiatorId" @closeModal="closeClash"/>
  </div>

</template>

<script>
import auth from "./../mixins/auth";
import ScheduleManager from "./../components/ScheduleManager.vue";
import GladiatorStats from "./../components/GladiatorStats.vue";
import EquipmentScreen from "./../components/EquipmentScreen.vue";
import ClashSettings from "./../components/ClashSettings.vue";

export default {
    
  name: "GladiatorMain",
  data() {
    return {
      userData: auth.getUser(),

      gladiatorId: null,
      showScheduleManager:false,
      showGladiatorStats:false,
      showEquipmentScreen:false,
      showClashSettings:false,
      ownerData: null,
    };
  },
  methods:{
    async openManager(event){
      this.gladiatorId = event.target.getAttribute("data-id");
      this.showScheduleManager = true;
    },
    closeManager(){
      this.showScheduleManager = false;
    },
    openStats(event){
      this.gladiatorId = event.target.getAttribute("data-id");
      this.showGladiatorStats = true;
    },
    closeStats(){
      this.showGladiatorStats = false;
    },

    openEquipment(event){
      this.gladiatorId = event.target.getAttribute("data-id");
      this.showEquipmentScreen = true;
    },
    closeEquipment(){
      this.showEquipmentScreen = false;
    },
    openClash(event){
      this.gladiatorId = event.target.getAttribute("data-id");
      this.showClashSettings = true;
    },
    closeClash(){
      this.showClashSettings = false;
    },


  },
  components:{
    ScheduleManager,
    GladiatorStats,
    EquipmentScreen,
    ClashSettings,
  },
  async mounted() {
    const rpnse = await fetch(
      `http://${window.location.hostname}:3001/owner`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "id": this.userData._id }),
      }
    );
    let ownerData = await rpnse.json();
    this.ownerData = ownerData;
  },
};
</script>

<style scoped></style>
