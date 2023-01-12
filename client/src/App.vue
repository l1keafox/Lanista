<template>
  <div class="flex h-full w-full">
    <!-- -->
    <div class="bg-blue-900 px-3" id="sideBar">
      <SideNav @logged="update" @changeMain="changeStage" />
    </div>
    <div class="bg-slate-900 grow">
      <component :is="mainStage" />
    </div>
  </div>
</template>

<script>
import WelcomeMain from "./views/WelcomeMain.vue";
import ProfileMain from "./views/ProfileMain.vue";
import GladiatorsMain from "./views/GladiatorsMain.vue";
import StructuresMain from "./views/StructuresMain.vue";
import TrainingMain from "./views/TrainingMain.vue";
import CombatMain from "./views/CombatMain.vue";
import StoreMain from "./views/StoreMain.vue";

import SideNav from "@/components/SideNav.vue";
import auth from "./mixins/auth";

export default {
  name: "App",
  components: {
    SideNav,
    ProfileMain,
    WelcomeMain,
    GladiatorsMain,
    TrainingMain,
    CombatMain,
    StoreMain,
    StructuresMain,
  },
  data() {
    return {
      isLoggedIn: auth.loggedIn(),
      mainStage: "WelcomeMain",
      userData: auth.getUser(),
      ownerData:null,
      
      ownerDataInterval:null
    };
  },
  methods: {
    changeStage(newStage) {
      this.mainStage = newStage;
    },
    update() {
      this.isLoggedIn = auth.loggedIn();
      console.log('udpate?',this.isLoggedIn);
      if( this.isLoggedIn ) this.startOwnerInterval();
    },
    startOwnerInterval(){
      this.getOwnerData();
      this.ownerDataInterval = setInterval(
        this.getOwnerData,15000
      );
    },    
    async getOwnerData(){
      const rpnse = await fetch(
      `http://${window.location.hostname}:3001/owner`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "id": this.userData._id }),
      }
      );
      this.ownerData = await rpnse.json();
      console.log('getting owner data',this.ownerData);
    },

  },

  mounted() {
    //console.log('mntd?',this.isLoggedIn);
    if( this.isLoggedIn ) this.startOwnerInterval();
  },
  provide() {
    return {
      card:"h-80 aspect-[5/7] p-3 m-3 cursor-default select-none flex flex-col bg-slate-700 rounded-lg",
      cardTitle:"text-xl text-sky-400",
      userData:this.userData,
      getOwnerData: ()=> this.ownerData
    };
  },
};
</script>

<style>
body {
  background-color: rgb(30, 30, 30);
  color: rgb(200, 200, 200);
}
#app {
  height: 100vh;
}

</style>
height: 100vh; width: 100vw;
