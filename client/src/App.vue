<template>
  <div class="flex flex-col h-full w-full overflow-hidden">
      <HeaderVue @logged="update" />
      <div class="flex h-full w-full">
        <SideNav  @logged="update" @changeMain="changeStage" />
        <component :is="mainStage" />
      </div>
  </div>
</template>

<script>
import WelcomeMain from "./views/WelcomeMain.vue";
import GladiatorsMain from "./views/GladiatorsMain.vue";
import SchoolMain from "./views/SchoolMain.vue";
import CombatMain from "./views/CombatMain.vue";
import StoreMain from "./views/StoreMain.vue";
import TournamentMain from "./views/TournamentMain.vue";

import SideNav from "@/components/SideNav.vue";
import HeaderVue from "@/components/Header.vue";
import auth from "./mixins/auth";

import {computed} from "vue"
export default {
  name: "App",
  components: {
    SideNav,
    HeaderVue,
    WelcomeMain,
    GladiatorsMain,
    CombatMain,
    TournamentMain,
    StoreMain,
    SchoolMain,
  },
  data() {
    return {
      isLoggedIn: auth.loggedIn(),
      mainStage: "WelcomeMain",
      userData: null,
      interval:null,
      ownerData:null
    };
  },
  methods: {
    changeStage(newStage) {
      this.mainStage = newStage;
    },
    update() {
      this.isLoggedIn = auth.loggedIn();
      this.userData =  auth.getUser();
      this.updateOwner();
    },

    async updateOwner() {

      if(this.userData == null){
          this.userData =  auth.getUser();
      }
			if (this.isLoggedIn) {
        
        try{
          const rpnse = await fetch(
					`http://${window.location.hostname}:3001/owner/${auth.getUser().ownerId}`,
					{
						headers: { "Content-Type": "application/json" },
					}
				);
				this.ownerData = await rpnse.json();
        }catch(err){
          console.log(err, "clearing")
          clearInterval(this.interval);
        }
			} else {
          clearInterval(this.interval);
      }
    
		},    
  },
  unmounted(){
    clearInterval(this.interval);
  },  
  mounted() {
    this.updateOwner();
		this.interval = setInterval(this.updateOwner,5000);
  },
  provide() {
    return {
      card:"h-80 w-56 p-3 m-3 cursor-default select-none flex flex-col bg-slate-700 rounded-lg",
      smallCard:"h-64 aspect-[5/7] p-3 m-3 cursor-default select-none flex flex-col bg-slate-700 rounded-lg",
      largeCard:"h-96 aspect-[5/7] p-3 m-3 cursor-default select-none flex flex-col bg-slate-700 rounded-sm",
      gladiatorCard:"h-[27rem] aspect-[5/7] p-3 m-3 cursor-default select-none flex flex-col bg-slate-700 rounded-lg",
      cardTitle:"text-xl text-sky-400",
      getOwner: computed(()=>this.ownerData),
      getUser: computed(()=>this.userData),
      getLogged: computed(()=>this.isLoggedIn),
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
