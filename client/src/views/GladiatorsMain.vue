<template>
  <div  class="flex flex-col w-full overflow-x-hidden">
    <h1>Gladiators</h1>
    <div  v-if="ownerData" class="flex" > 
        <div v-for="glad in ownerData.gladiators" :key="glad" :class="card"> 
        
        <h1 :class="cardTitle">{{glad.name}} </h1>
        <h2> Age:{{glad.age}}</h2>

        <hr/>
        <button class="bg-yellow-200 m-2 text-purple-900" @click="openModal($event,'ScheduleManager')" :data-id="glad._id">Schedule  </button>
        <button class="bg-blue-200 m-2 text-purple-700"   @click="openModal($event,'GladiatorStats')"  :data-id="glad._id">Stats  </button>
        <button class="bg-red-200 m-2 text-purple-700" @click="openModal($event,'EquipmentScreen')"    :data-id="glad._id">Equipment  </button>
        <button class="bg-green-200 m-2 text-purple-700" @click="openModal($event,'ClashSettings')"    :data-id="glad._id">Clash  </button>
      </div>
    </div>
  </div>
  <div v-if="isModalShown">
    <component :is="modalShown" :gladId="gladiatorId" @closeModal="closeModal"/>
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
      modalShown:null,
      isModalShown:null,
      gladiatorId: null,
      ownerData: null,
    };
  },
  inject: ['card','cardTitle'],
  methods:{
    openModal(event,modalName){
      this.gladiatorId = event.target.getAttribute("data-id");
      this.isModalShown = true;
      this.modalShown = modalName;
    },
    closeModal(){
      this.isModalShown = false;
    },
    async updateOwnerInfo(){
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
    console.log('updated info') ;
    }

  },
  components:{
    ScheduleManager,
    GladiatorStats,
    EquipmentScreen,
    ClashSettings,
  },
  async mounted() {
    this.updateOwnerInfo();
//    setInterval(this.updateOwnerInfo, 15000);
  },
};
</script>

<style scoped></style>
