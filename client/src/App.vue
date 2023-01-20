<template>
  <div class="flex h-full w-full overflow-hidden">
      <SideNav @logged="update" @changeMain="changeStage" />
      <component :is="mainStage" />
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
      userData: auth.getUser()
    };
  },
  methods: {
    changeStage(newStage) {
      this.mainStage = newStage;
    },
    update() {
      this.isLoggedIn = auth.loggedIn();
    },
  },

  mounted() {},
  provide() {
    return {
      card:"h-80 aspect-[5/7] p-3 m-3 cursor-default select-none flex flex-col bg-slate-700 rounded-lg",
      smallCard:"h-64 aspect-[5/7] p-3 m-3 cursor-default select-none flex flex-col bg-slate-700 rounded-lg",
      cardTitle:"text-xl text-sky-400",
      userData:this.userData
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
