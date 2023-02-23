<template>
  <div  class="flex flex-wrap w-full overflow-y-scroll  ">
    <template  v-if="ownerData"> 
        <div v-for="glad in ownerData.gladiators" :key="glad" :class="gladiatorCard" class="relative"> 

        <Chracter class="absolute z-50 -right-[2px] top-[20px] h-[7rem] w-[7rem]" :clothes="makeClothes(glad)" :animation="jobToAnimate()" :direction="jobDirection()" :gladName="glad.name"/>
        <span class="absolute z-50 right-10 top-4" > {{ glad.lastGain[0] }} </span>
        <span class="absolute z-50 right-10 top-24" id="growth" > {{ glad.lastGain[growthIndex] }} </span>
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
import Chracter from "../components/Character.vue"
import DuelReplay from "../components/modals/DuelReplay.vue";

import GladiatorMemories from "../components/modals/GladiatorMemories.vue";
import DuelHistory from "./../components/modals/DuelHistory.vue";
import { useIntervalFn } from '@vueuse/core'
export default {
    
  name: "GladiatorMain",
  data() {
    this.jobToAnimate = function(job){
      switch(job){
        default:
          let rando = ["walk","stand","push","pull","jump","run"];
          let random = Math.floor(Math.random()*rando.length)
          return rando[random]
        }
    }

    this.jobDirection = function(job){
      switch(job){
        default:
          let rando = ["up","down","left","right"];
          let random = Math.floor(Math.random()*rando.length)
          return rando[random]
      }
    }

    return {
      userData: auth.getUser(),
      growthIndex : 1,
      modalShown:null,
      isModalShown:null,
      gladiatorId: null,
      ownerData: null,
      
    };
  },
  inject: ['gladiatorCard','cardTitle','card','getOwner'],
  methods:{
    makeClothes(glad){
      return { hair:glad.hairChar, skin:glad.skinChar, sex:glad.sexChar, body:1 }
    },
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
    DuelReplay,
    Chracter,
    ScheduleManager,
    GladiatorMemories,
    GladiatorTournament,
    GladiatorStats,
    DuelHistory,
    EquipmentScreen,
    ClashSettings,
  },
  setup(){

  },
  async mounted() {
    this.ownerData = this.getOwner;
    // console.log( this.ownerData)

    const { pause, resume, isActive } = useIntervalFn(() => {
      this.growthIndex++;
      if(this.growthIndex > 5){
        this.growthIndex = 1;
      }
    }, 1950)


  },
};
</script>

<style scoped>
@keyframes redGlow {
	0% {
		opacity: 0;
	}
	50% {
		opacity: 100;
	}
	100% {
		opacity: 0;
	}
}
#growth {
	animation: redGlow 2.1s infinite;
}
</style>
