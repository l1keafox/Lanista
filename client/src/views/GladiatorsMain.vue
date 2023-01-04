<template>
  <div>
    <h1>Gladiators</h1>
    <div  v-if="ownerData" class="flex justify-center items-center" > 
        <div v-for="glad in ownerData.gladiators" :key="glad" class="h-80 aspect-[5/7] p-3 m-3 hover:bg-slate-200 cursor-default select-none flex flex-col bg-slate-700"> 
        
        <h1>{{glad.name}} </h1>
        <h2>{{glad.hits}}/{{glad.mana}} </h2>
        <h2>{{glad.morale}}/{{glad.stress}} </h2>

        <button class="bg-yellow-200 m-2 text-purple-900" @click="openManager($event)" :data-id="glad._id">schedule  </button>
        <button class="bg-blue-200 m-2 text-purple-700" @click="openStats($event)" :data-id="glad._id">stats  </button>
      </div>
    </div>
  </div>
  <div v-if="showScheduleManager">
    <ScheduleManager :gladId="gladiatorId" @closeSchedule="closeManager"/>
  </div>
  <div v-if="showGladiatorStats">
    <GladiatorStats :gladId="gladiatorId" @closeStats="closeStats"/>
  </div>
</template>

<script>
import auth from "./../mixins/auth";
import ScheduleManager from "./../components/ScheduleManager.vue";
import GladiatorStats from "./../components/GladiatorStats.vue";

export default {
    
  name: "GladiatorMain",
  data() {
    return {
      userData: auth.getUser(),

      gladiatorId: null,
      showScheduleManager:false,
      showGladiatorStats:false,
      ownerData: null,
    };
  },
  methods:{
    async openManager(event){
      console.log("Manager",event.target.getAttribute("data-id"));
      this.gladiatorId = event.target.getAttribute("data-id");
      this.showScheduleManager = true;
    },
    closeManager(){
      this.showScheduleManager = false;
    },
    openStats(event){
      console.log("Stats",event.target.getAttribute("data-id"));
      this.gladiatorId = event.target.getAttribute("data-id");
      this.showGladiatorStats = true;
    },
    closeStats(){
      this.showGladiatorStats = false;
    },
  },
  components:{
    ScheduleManager,
    GladiatorStats,
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
