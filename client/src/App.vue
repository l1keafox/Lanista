<template>
  <MainViewVue/>
  <!-- <div> {{isLoggedIn}}</div>
  <div v-if="isLoggedIn" class="h-screen">
  </div> -->
  <!-- <div v-else>
    <LandingPage/>
  </div> -->
</template>

<script>
// import LandingPage from "./views/LandingPage";
import MainViewVue from "./views/MainView.vue";
import auth from "./mixins/auth";
import decode from "jwt-decode";
export default {
  name: 'App',
  components: {
//    LandingPage,
    MainViewVue
  },
  data(){
    return {
      isLoggedIn: false,
    }
  },
  mounted(){
    let dtz = decode(  localStorage.getItem("id_token"));
    console.log(dtz);
    this.isLoggedIn = auth.loggedIn();
  },
  provide(){
    return{
      isLoggedIn:this.isLoggedIn
    }
  }
}
</script>

<style>
body{
  background-color: rgb(30, 30, 30);
  height: 100vh;
  width: 100vw;
  }
  #app{
    height: 100vh;
    width: 100vw;
  }
</style>
