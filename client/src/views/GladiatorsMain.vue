<template>
  <div  class="flex flex-wrap w-full overflow-y-scroll ">
    <template  v-if="ownerData"> 
        <div v-for="glad in ownerData.gladiators" :key="glad" :class="gladiatorCard"> 
        
        <h1 :class="cardTitle">{{glad.name}} </h1>

        <h2> Level:{{glad.level}} /  Age:{{glad.age}}</h2>
        <h2> Wins:{{glad.winRecord }} / Loss:{{glad.lossRecord }}</h2>
        <h2> Local: {{glad.weekWin }} / Regional : {{glad.monthWin }}</h2>
        <h2> Quarter : {{glad.quarterWin }} / National: {{glad.yearWin }}</h2>

        <hr/>
        <button class="bg-yellow-200 m-2 text-purple-900 rounded" @click="openModal($event,'ScheduleManager')" :data-id="glad._id">Schedule  </button>
        <button class="bg-blue-200 m-2 text-purple-700 rounded"   @click="openModal($event,'GladiatorStats')"  :data-id="glad._id">Stats  </button>
        <button class="bg-red-200 m-2 text-purple-700 rounded" @click="openModal($event,'EquipmentScreen')"    :data-id="glad._id">Equipment  </button>
        <button class="bg-green-200 m-2 text-purple-700 rounded" @click="openModal($event,'ClashSettings')"    :data-id="glad._id">Clash  </button>
        <button class="bg-purple-200 m-2 text-purple-700 rounded" @click="openModal($event,'GladiatorMemories')"   :data-id="glad._id">Memories  </button>
        <button class="bg-slate-200 m-2 text-purple-700 rounded" @click="openModal($event,'DuelHistory')"      :data-id="glad._id">Duel History  </button>
        <button class="bg-pink-200 m-2 text-purple-700 rounded" @click="openModal($event,'GladiatorTournament')"      :data-id="glad._id">Tournament History</button>
        
      </div>
    </template>
  </div>
  <div v-if="isModalShown">
    <component :is="modalShown" :gladId="gladiatorId" @closeModal="closeModal"/>
  </div>

</template>

<script>
import auth from "./../mixins/auth";
import ScheduleManager from "./../components/modals/ScheduleManager.vue";
import GladiatorStats from "./../components/modals/GladiatorStats.vue";
import ClashSettings from "./../components/modals/ClashSettings.vue";
import EquipmentScreen from "./../components/modals/EquipmentScreen.vue";
import GladiatorTournament from "./../components/modals/GladiatorTournamentHistory.vue";

import GladiatorMemories from "../components/modals/GladiatorMemories.vue";
import DuelHistory from "./../components/modals/DuelHistory.vue";

export default {
    
  name: "GladiatorMain",
  data() {
    return {
      userData: auth.getUser(),
      modalShown:null,
      isModalShown:null,
      gladiatorId: null,
      ownerData: null,
      
    };
  },
  inject: ['gladiatorCard','cardTitle','card','getOwner'],
  methods:{
    openModal(event,modalName){
      this.gladiatorId = event.target.getAttribute("data-id");
      this.isModalShown = true;
      this.modalShown = modalName;
    },
    closeModal(){
      this.isModalShown = false;
    },
  },
  components:{
    ScheduleManager,
    GladiatorMemories,
    GladiatorTournament,
    GladiatorStats,
    DuelHistory,
    EquipmentScreen,
    ClashSettings,
  },
  async mounted() {
    this.ownerData = this.getOwner;
  },
};
</script>

<style scoped></style>
