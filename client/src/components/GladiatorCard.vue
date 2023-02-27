<template>
  <div  class="flex flex-wrap">
      <div v-if="glad" :class="gladiatorCard" class="relative"> 
        <Character class="absolute z-10 -right-[2px] top-[20px] h-[7rem] w-[7rem]" :clothes="makeClothes(glad)" :animation="jobToAnimate" :direction="jobDirection" :gladName="glad.name"/>
        <span class="absolute z-10 right-10 top-4" v-if="training"> {{ training[0] }} </span>
        <span class="absolute z-10 right-10 top-24"  v-if="training" id="growth" > {{ training[growthIndex] }} </span>
        <h1 :class="cardTitle">{{glad.name}} </h1>

        <h2> Level:{{glad.level}} /  Age:{{glad.age}}</h2>
        <h2> Wins:{{glad.winRecord }} / Loss:{{glad.lossRecord }}</h2>
        <h2> Local: {{glad.weekWin }} / Regional : {{glad.monthWin }}</h2>
        <h2> Quarter : {{glad.quarterWin }} / National: {{glad.yearWin }}</h2>
        <hr/>
        <button class="bg-blue-200 m-2 text-purple-700 rounded"   @click="openModal($event,'GladiatorDetails')"  :data-id="glad._id">Details  </button>
        <button class="bg-yellow-200 m-2 text-purple-900 rounded" @click="openModal($event,'ScheduleManager')" :data-id="glad._id">Schedule  </button>
        <button class="bg-purple-200 m-2 text-purple-700 rounded" @click="openModal($event,'GladiatorMemories')"   :data-id="glad._id">History/Memories  </button>
        <!-- <button class="bg-slate-200 m-2 text-purple-700 rounded" @click="openModal($event,'DuelHistory')"      :data-id="glad._id">Duel History  </button>
        <button class="bg-pink-200 m-2 text-purple-700 rounded" @click="openModal($event,'GladiatorTournament')"      :data-id="glad._id">Tournament History</button> -->
        
      </div>
  </div>
  <div v-if="isModalShown">
    <component :is="modalShown" :gladId="gladiatorId" @closeModal="closeModal"/>
  </div>

</template>

<script>
import auth from "./../mixins/auth";
import ScheduleManager from "./../components/modals/ScheduleManager.vue";
import GladiatorDetails from "./../components/modals/GladiatorDetails.vue";
import GladiatorTournament from "./../components/modals/GladiatorTournamentHistory.vue";
import Character from "../components/Character.vue"
import DuelReplay from "../components/modals/DuelReplay.vue";

import GladiatorMemories from "../components/modals/GladiatorMemories.vue";
import DuelHistory from "./../components/modals/DuelHistory.vue";
import { useIntervalFn } from '@vueuse/core'
export default {
    
  name: "GladiatorMain",
  props:['glad'],
  data() {
    return {
      training:null,
      growthIndex : 1,
      modalShown:null,
      isModalShown:null,
      gladiatorId: null,
      jobToAnimate: "stand",
      jobDirection: "down"
      
    };
  },
  watch: {
    training: function (val) {
      this.jobToAnimate = this.getAnimate()
      this.jobDirection = this.getDirection()

    },
  },
  inject: ['gladiatorCard','cardTitle','card','getOwner'],
  methods:{
    getDirection(job){
      switch(job){
        default:
          let rando = ["Up","Down","Left","Right"];
          let random = Math.floor(Math.random()*rando.length)
          return rando[random]
      }
    },
    getAnimate(job){
      switch(job){
        default:
          let rando = ["walk","stand","jump","run","push","pull"]; //
          let random = Math.floor(Math.random()*rando.length)
          return rando[random]
        }
    },
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
    Character,
    ScheduleManager,
    GladiatorMemories,
    GladiatorTournament,
    GladiatorDetails,
    DuelHistory,
  },
  setup(){

  },
  async mounted() {
    this.training = this.glad.lastGain
    const { pause, resume, isActive } = useIntervalFn(() => {
      this.growthIndex++;
      if(this.growthIndex > 5){
        this.growthIndex = 1;
      }
      this.training = this.glad.lastGain
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
