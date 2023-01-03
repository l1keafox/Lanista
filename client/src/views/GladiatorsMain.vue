<template>
  <div>
    <h1>Gladiators</h1>
    <div  v-if="ownerData" class="flex justify-center items-center" > 
        <div v-for="glad in ownerData.gladiators" :key="glad" class="h-80 aspect-[5/7] p-3 m-3 hover:bg-slate-200 cursor-default select-none flex flex-col justify-between bg-slate-700"> 
        
        <h2>{{glad.name}} </h2>
        <h2>{{glad.hits}} </h2>
        <h2>{{glad._id}} </h2>
        <button class="bg-yellow-200" @click="openManager($event)" :data-id="glad._id">schedule  </button>
      </div>
    </div>
  </div>
  <div v-if="showScheduleManager">
    <ScheduleManager/>
  </div>
</template>

<script>
import auth from "./../mixins/auth";
import ScheduleManager from "./../components/ScheduleManager.vue";
export default {
    
  name: "GladiatorMain",
  data() {
    return {
      userData: auth.getUser(),
      showScheduleManager:false,
      ownerData: null,
    };
  },
  methods:{
    async openManager(event){
      console.log("Manager",event.target.getAttribute("data-id"));
    }
  },
  components:{
    ScheduleManager,
  },
  async mounted() {
    const rpnse = await fetch(
      `http://${window.location.hostname}:3001/users/owner`,
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
