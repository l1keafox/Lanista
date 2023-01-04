<template>
  <div class="flex h-full ">
    <!-- -->
    <div class="bg-blue-900 w-48"> 
        <SideNav @logged="update" @changeMain="changeStage"/>
    </div>
    <div class="bg-slate-900 grow "> 
      <component :is="mainStage" />
    </div>
  </div>

</template>

<script>
import WelcomeMain from "./views/WelcomeMain.vue";
import ProfileMain from "./views/ProfileMain.vue";
import GladiatorsMain from "./views/GladiatorsMain.vue";
import StructuresMain from "./views/StructuresMain.vue";

import SideNav from '@/components/SideNav.vue';
import auth from "./mixins/auth";

export default {
  name: 'App',
  components: {
    SideNav,
    ProfileMain,
    WelcomeMain,
    GladiatorsMain,
    StructuresMain
  },
  data(){
    return {
      isLoggedIn: auth.loggedIn(),
      mainStage:"WelcomeMain"
    }
  },
  methods:{
    changeStage(newStage){
      this.mainStage = newStage;
    },
            update(){
                this.isLoggedIn = auth.loggedIn();
            }
        },  

  mounted(){
  },
  provide(){
    return{
    }
  }
}
</script>

<style>
body{
  background-color: rgb(30, 30, 30);
  height: 100vh;
  width: 100vw;
  color:rgb(200, 200, 200)
  }
  #app{
    height: 100vh;
    width: 100vw;
  }
</style>
